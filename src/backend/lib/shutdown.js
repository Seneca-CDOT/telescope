const { promisify } = require('util');

const feedQueue = require('../feed/queue');
const { logger: log } = require('../utils/logger');
const server = require('../web/server');

let isShuttingDown = false;

function stopQueue() {
  return feedQueue
    .close()
    .then(() => log.info('Feed queue shut down.'))
    .catch(err => log.error('Unable to close feed queue gracefully', { err }));
}

function stopWebServer() {
  const serverClose = promisify(server.close.bind(server));
  return serverClose()
    .then(() => log.info('Web server shut down.'))
    .catch(err => log.error('Unable to close web server gracefully', { err }));
}

function shutdown(signal) {
  return cause => {
    if (isShuttingDown) {
      return;
    }

    log.info(`Received ${signal}, starting shut down`);
    isShuttingDown = true;

    if (cause) {
      log.error({ cause });
    }

    // If our attempts to shut down cleanly don't work, force it
    setTimeout(() => {
      log.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 5000).unref();

    // Try to shut down cleanly
    Promise.all([stopQueue(), stopWebServer()])
      .then(() => {
        log.info('Completing shut down.');
        process.exit(0);
      })
      .catch(err => {
        log.error('Failed to perform clean shutdown', { err });
        process.exit(1);
      });
  };
}

module.exports = shutdown;
