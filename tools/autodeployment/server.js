require('dotenv').config();
const http = require('http');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');

const { SECRET, REPO_NAME, DEPLOY_PORT, DEPLOY_TYPE } = process.env;

const handler = createHandler({ path: '/', secret: SECRET });

http
  .createServer((req, res) => {
    handler(req, res);
  })
  .listen(DEPLOY_PORT, () => {
    console.log(`Server listening on port ${DEPLOY_PORT}`);
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
      // Execute the shell script and pass two arguments, our deployment type and the .env file to use
      shell.exec(`./deploy.sh production`);
    }
  });
}

if (DEPLOY_TYPE === 'staging') {
  handler.on('push', (event) => {
    const { name } = event.payload.repository;

    if (name === REPO_NAME) {
      // Execute the shell script and pass two arguments, our deployment type and the .env file to use
      shell.exec(`./deploy.sh staging`);
    }
  });
}
