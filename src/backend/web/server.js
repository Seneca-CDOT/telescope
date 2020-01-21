require('../lib/config');
const https = require('https');
const fs = require('fs');

const app = require('./app.js');

const { logger } = app.get('logger');
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 4443;

const { key, cert } = (() => {
  const certdir = fs
    .readdirSync('/etc/letsencrypt/live', { withFileTypes: true })
    .filter(file => file.isDirectory())[0].name;

  return {
    key: fs.readFileSync(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${certdir}/fullchain.pem`),
  };
})();

const server = app.listen(HTTP_PORT, () => {
  logger.info(`Telescope listening on port ${HTTP_PORT}`);
});

https
  .createServer({ key, cert }, app)
  .listen(HTTPS_PORT, () => console.log(`HTTPS server listening on ${HTTPS_PORT}`));

module.exports = server;
