require('../lib/config');
const app = require('./app.js');

const { logger } = app.get('logger');
const HTTP_PORT = process.env.PORT || 3000;

const server = app.listen(HTTP_PORT, () => {
  logger.info(`Telescope listening on port ${HTTP_PORT}`);
});

module.exports = server;
