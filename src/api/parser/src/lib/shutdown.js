const { promisify } = require('util');

const { logger } = require('@senecacdot/satellite');
const feedQueue = require('../feed/queue');
const server = require('../server');

let isShuttingDown = false;

async function stopQueue() {
  try {
    await feedQueue.close();
    logger.info('Feed queue shut down.');
  } catch (error) {
    logger.debug({ error }, 'Unable to close feed queue gracefully');
  }
}

async function stopWebServer() {
  // Use stopppable's server.stop() instead of httpServer.close()
  // to force connections to close as well.  See:
  // https://github.com/hunterloftis/stoppable
  const serverClose = promisify(server.stop.bind(server));
  try {
    await serverClose();
    logger.info('Web server shut down.');
  } catch (error) {
    logger.debug({ error }, 'Unable to close web server gracefully');
  }
}

async function cleanShutdown() {
  try {
    await Promise.all([stopQueue(), stopWebServer()]);
    logger.info('Completing shut down.');
  } catch (error) {
    logger.debug({ error }, 'Failed to perform clean shutdown');
  }
}

function shutdown(signal) {
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
}

module.exports = shutdown;
