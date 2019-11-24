require('./lib/config.js');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { logger } = require('./utils/logger');
const wikiFeed = require('./utils/wiki-feed-parser');

const log = logger.child({ module: 'main' });

// Start the web server
const server = require('./web/server');

/**
 * Stops the Redis Queue, web server, etc. closing all connections gracefully
 */
let isShuttingDown = false;

function shutDown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  log.info('Received kill signal, shutting down gracefully');

  // Force shutting down
  setTimeout(() => {
    log.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);

  // Try to shut down
  Promise.all([
    // 1. Shutdown the queue
    feedQueue
      .close()
      .then(() => log.info('Feed queue shut down.'))
      .catch(err => log.error('Unable to close feed queue gracefully', err)),
    // 2. Shutdown the web server, if necessary
    new Promise((resolve, reject) => {
      if (!(server && server.listening)) {
        log.info('Web server already shut down.');
        resolve();
        return;
      }
      server.close(err => {
        if (err) {
          log.error('Unable to close web server gracefully', { err });
          reject(err);
        } else {
          log.info('Web server shut down.');
          resolve();
        }
      });
    }),
  ])
    .then(() => {
      log.info('Shutting down.');
      process.exit(0);
    })
    .catch(err => log.error(err));
}

/**
 * Shutting Down Logic for most Server Shutdown Cases
 */
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('unhandledRejection', err => {
  log.error({ err }, 'UNHANDLED REJECTION: Shutting down...');
  shutDown();
});
process.on('uncaughtException', err => {
  log.error({ err }, 'UNCAUGHT EXCEPTION: Shutting down...');
  shutDown();
});

/**
 * Adds feed URL jobs to the feed queue for processing
 * @param {Array[Object]} feedJobs - list of feed URL jobs to be processed
 */
async function enqueueWikiFeed() {
  const data = await wikiFeed.parseData();
  Promise.all(
    data.map(async feedJob => {
      log.info(`Enqueuing feed job for ${feedJob.url}`);
      await feedQueue.add(feedJob, {
        attempts: 8,
        backoff: {
          type: 'exponential',
          delay: 60 * 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      });
    })
  ).catch(err => log.error({ err }, 'Error queuing wiki feeds'));
}

enqueueWikiFeed()
  .then(() => {
    feedWorker.start();
  })
  .catch(error => {
    log.error({ error }, 'Unable to enqueue wiki feeds');
  });
