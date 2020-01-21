const { promisify } = require('util');

const feedQueue = require('../feed/queue');
const { logger } = require('../utils/logger');
const server = require('../web/server');

let isShuttingDown = false;

function stopQueue() {
  return feedQueue
    .close()
    .then(() => logger.info('Feed queue shut down.'))
    .catch(error => logger.error({ error }, 'Unable to close feed queue gracefully'));
}

function stopWebServer() {
  const serverClose = promisify(server.close.bind(server));
  return serverClose()
    .then(() => logger.info('Web server shut down.'))
    .catch(error => logger.error({ error }, 'Unable to close web server gracefully'));
}

function cleanShutdown() {
  return Promise.all([stopQueue(), stopWebServer()])
    .then(() => logger.info('Completing shut down.'))
    .catch(error => logger.error({ error }, 'Failed to perform clean shutdown'));
}

function shutdown(signal) {
  return async error => {
    if (isShuttingDown) {
      return;
    }

    logger.info(`Received ${signal}, starting shut down`);
    isShuttingDown = true;

    if (error) {
      logger.error({ error });
    }

    // If our attempts to shut down cleanly don't work, force it
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      logger.flush();
      process.exit(1);
    }, 10000).unref();

    // Try to shut down cleanly
    await cleanShutdown();
    process.exit(error ? 1 : 0);
  };
}

module.exports = shutdown;
