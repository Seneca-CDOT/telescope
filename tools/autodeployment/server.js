require('dotenv').config();
const http = require('http');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');

const { buildStart, buildStop, handleStatus } = require('./info');

const { SECRET, REPO_NAME, DEPLOY_PORT, DEPLOY_TYPE } = process.env;

function handleError(req, res) {
  res.statusCode = 404;
  res.end('Not Found');
}

const handler = createHandler({ path: '/', secret: SECRET });

http
  .createServer((req, res) => {
    if (req.url === '/status') {
      handleStatus(req, res);
    } else {
      handler(req, res, () => handleError(req, res));
    }
  })
  .listen(DEPLOY_PORT, () => {
    console.log(`Server listening on port ${DEPLOY_PORT}. Use /status for status info.`);
  });

handler.on('error', (err) => {
  console.error('Error:', err.message);
});

if (!(DEPLOY_TYPE === 'staging' || DEPLOY_TYPE === 'production')) {
  console.error("DEPLOY_TYPE must be one of 'staging' or 'production'");
  process.exit(1);
}

if (DEPLOY_TYPE === 'production') {
  handler.on('release', (event) => {
    const { name } = event.payload.repository;

    if (name === REPO_NAME) {
      buildStart('production');
      shell.exec(`./deploy.sh production`, (code, stdout, stderr) => {
        buildStop(code);
        console.log(stdout);
        console.error(stderr);
      });
    }
  });
}

if (DEPLOY_TYPE === 'staging') {
  handler.on('push', (event) => {
    const { name } = event.payload.repository;

    if (name === REPO_NAME) {
      buildStart('staging');
      shell.exec(`./deploy.sh staging`, (code, stdout, stderr) => {
        buildStop(code);
        console.log(stdout);
        console.error(stderr);
      });
    }
  });
}
