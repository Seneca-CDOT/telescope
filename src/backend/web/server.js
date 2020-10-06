require('../lib/config');
const stoppable = require('stoppable');

const app = require('./app.js');

const { logger } = app.get('logger');
const HTTP_PORT = process.env.PORT || 3000;

// Make our server not block when we want it to close.
const server = stoppable(
  app.listen(HTTP_PORT, () => {
    logger.info(`Telescope listening on port ${HTTP_PORT}`);
  })
);

module.exports = server;
