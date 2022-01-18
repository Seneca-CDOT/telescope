const { logger } = require('@senecacdot/satellite');
const { feedQueue } = require('../feed/queue');

let isShuttingDown = false;

const stopQueue = async () => {
  try {
    await feedQueue.close();
    logger.info('Feed queue shut down.');
  } catch (error) {
    logger.debug({ error }, 'Unable to close feed queue gracefully');
  }
};

const cleanShutdown = async () => {
  try {
    await stopQueue();
    logger.info('Completing shut down.');
  } catch (error) {
    logger.debug({ error }, 'Failed to perform clean shutdown');
  }
};

const shutdown = (signal) => {
  return async (error) => {
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
};

module.exports = shutdown;
