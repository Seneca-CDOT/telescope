require('dotenv').config();
const path = require('path');
const https = require('https');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');
const mergeStream = require('merge-stream');
const fs = require('fs');
const { firstCheck } = require('./src/sibling-checker');

const { buildStart, buildStop, handleStatus } = require('./info');

// Server health check

firstCheck();

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

const privateKey = fs.readFileSync(path.join(PATH_TO_CERTS, 'privkey.pem'));
const certificate = fs.readFileSync(path.join(PATH_TO_CERTS, 'fullchain.pem'));

const credentials = {
  key: privateKey,
  cert: certificate,
};

function handleError(req, res) {
  res.statusCode = 404;
  res.end('Not Found');
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

const handleGitPush = createHandler({ path: '/', secret: SECRET });

https
  .createServer(credentials, (req, res) => {
    // Build Status Info as JSON
    if (req.url === '/status') {
      handleStatus(req, res);
    }
    // Build Log Stream (if build is happening)
    else if (req.url === '/log') {
      handleLog(req, res);
    }
    // Process GitHub Push Event, or error (404)
    else {
      handleGitPush(req, res, () => handleError(req, res));
    }
  })
  .listen(DEPLOY_PORT, () => {
    console.log(`Server listening on port ${DEPLOY_PORT}.\nUse /status or /log for build info.`);
  });

handleGitPush.on('error', (err) => {
  console.error('Error:', err.message);
});

if (!(DEPLOY_TYPE === 'staging' || DEPLOY_TYPE === 'production')) {
  console.error("DEPLOY_TYPE must be one of 'staging' or 'production'");
  process.exit(1);
}

/**
 * Create a handler for the particular GitHub push event and build type
 * @param {String} buildType - one of `production` or `staging`
 * @param {String} gitHubEvent - the GitHub Push Event name
 */
function handleEventType(buildType, gitHubEvent) {
  if (DEPLOY_TYPE !== buildType) {
    return;
  }

  handleGitPush.on(gitHubEvent, (event) => {
    const { name } = event.payload.repository;

    if (name === REPO_NAME) {
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
