require('dotenv').config();
const http = require('http');
const createHandler = require('github-webhook-handler');
const shell = require('shelljs');

const { SECRET, REPO_NAME, DEPLOY_PORT } = process.env;

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

handler.on('push', (event) => {
  const { name } = event.payload.repository;

  if (name === REPO_NAME) {
    shell.exec('./deploy_stage.sh');
  }
});
