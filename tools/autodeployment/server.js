require('dotenv').config();
const path = require('path');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { Webhooks } = require('@octokit/webhooks');
const shell = require('shelljs');
const mergeStream = require('merge-stream');
const fs = require('fs');
const { firstCheck } = require('./src/sibling-checker');

const { buildStart, buildStop, handleStatus } = require('./info');

const app = express();
app.use(bodyParser.json());

// Current build process output stream (if any)
let out;
const {
  SECRET,
  REPO_NAME,
  DEPLOY_PORT,
  DEPLOY_TYPE,
  UNSPLASH_CLIENT_ID,
  PATH_TO_CERTS,
} = process.env;

// Server health check
firstCheck();

const privateKey = fs.readFileSync(path.join(PATH_TO_CERTS, 'privkey.pem'));
const certificate = fs.readFileSync(path.join(PATH_TO_CERTS, 'fullchain.pem'));

const credentials = {
  key: privateKey,
  cert: certificate,
};

function handleError(req, res, error = 'Not Found') {
  res.statusCode = 404;
  res.end(error);
}

// If a build is in process, pipe stderr and stdout to the request
function handleLog(req, res) {
  if (!out) {
    handleError(req, res);
    return;
  }

  function end(message) {
    if (message) {
      res.write(message);
    }
    res.end();
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  out.on('data', (data) => res.write(data));
  out.on('error', () => end('Error, end of log.'));
  out.on('end', () => end('Build Complete.'));
}

const handleGitPush = new Webhooks({ path: '/', secret: SECRET });

// Build Status Info as JSON
app.get('/status', function (req, res) {
  handleStatus(req, res);
});

// Build Log Stream (if build is happening)
app.get('/log', function (req, res) {
  handleLog(req, res);
});

// Process GitHub Push Event
app.post('/', async function (req, res) {
  try {
    /**
     * @octokit/webhooks .verifyAndReceive
     * https://github.com/octokit/webhooks.js#webhooksverifyandreceive
     */
    await handleGitPush.verifyAndReceive({
      id: req.header('X-GitHub-Hook-ID'),
      name: req.header('X-GitHub-Event'),
      payload: req.body,
      signature: req.header('X-Hub-Signature'),
    });

    handleStatus(req, res);
  } catch ({ errors }) {
    handleError(req, res, errors);
  }
});

// Error (404)
app.get('*', function (req, res) {
  handleError(req, res);
});

/*
 * @octokit/webhooks .onError
 * https://github.com/octokit/webhooks.js#webhooksonerror
 */
handleGitPush.onError((err) => {
  console.error('Error:', err);
});

/**
 * GitHub's webhooks send 3 POST requests with different actions whenever a release event takes place: created, published and released.
 * To prevent the autodeployment server from processing the 3 requests (and eventually crashing),
 * we need to only allow the request whose action is 'published'.
 * More information about release events here:
 * https://docs.github.com/en/actions/reference/events-that-trigger-workflows#release
 * The filter combines checking for staging or production build types and also for the right type of action for a release event in production builds
 * @param {string} name - Repository name (should be 'telescope')
 * @param {string} buildType - Build type: staging or production
 * @param {string} action - Action for a specific release event: created, published or released.
 */
function requestFilter(name, buildType, action) {
  return (
    name === REPO_NAME &&
    (buildType === 'staging' || (buildType === 'production' && action === 'published'))
  );
}

/**
 * Create a handler for the particular GitHub push event and build type
 * @param {string} buildType - one of `production` or `staging`
 * @param {string} gitHubEvent - the GitHub Push Event name
 */
function handleEventType(buildType, gitHubEvent) {
  if (DEPLOY_TYPE !== buildType) {
    return;
  }

  /**
   * @otcokit/webhooks .on
   * https://github.com/octokit/webhooks.js#webhookson
   */
  handleGitPush.on(gitHubEvent, (event) => {
    const { name } = event.payload.repository;
    const { action } = event.payload;

    if (requestFilter(name, buildType, action)) {
      buildStart(buildType);
      const proc = shell.exec(
        `./deploy.sh ${buildType} ${UNSPLASH_CLIENT_ID}`,
        { silent: true },
        (code, stdout, stderr) => {
          out = null;
          buildStop(code);
          console.log(stdout);
          console.error(stderr);
        }
      );

      // Combine stderr and stdout, like 2>&1
      out = mergeStream(proc.stdout, proc.stderr);
    }
  });
}

// Production builds happen when GitHub sends us a `release` event
handleEventType('production', 'release');

// Staging builds happen when GitHub sends us a `push` event
handleEventType('staging', 'push');

https.createServer(credentials, app).listen(DEPLOY_PORT, () => {
  console.log(`Server listening on port ${DEPLOY_PORT}.\nUse /status or /log for build info.`);
});
