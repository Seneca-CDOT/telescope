const fs = require('fs');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { logger } = require('./utils/logger');

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
 * Process a string into a list of Objects, each with a feed URL
 * @param {String} lines
 */
function processFeedUrls(lines) {
  return (
    lines
      // Divide the file into separate lines
      .split(/\r?\n/)
      // Basic filtering to remove any ines that don't look like a feed URL
      .filter(line => line.startsWith('http'))
      // Convert this into an Object of the form expected by our queue
      .map(url => ({ url }))
  );
}

/**
 * Adds feed URL jobs to the feed queue for processing
 * @param {Array[Object]} feedJobs - list of feed URL jobs to be processed
 */
async function enqueueFeedJobs(feedJobs) {
  feedJobs.forEach(async feedJob => {
    log.info(`Enqueuing Job - ${feedJob.url}`);
    await feedQueue.add(feedJob, {
      attempts: process.env.FEED_QUEUE_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: process.env.FEED_QUEUE_DELAY,
      },
      removeOnComplete: true,
      removeOnFail: true,
    });
  });
}

/**
 * For now, do something simple and just read a few feeds from a text file
 */
fs.readFile('feeds.txt', 'utf8', (err, lines) => {
  if (err) {
    log.error('unable to read initial list of feeds', err.message);
    process.exit(-1);
    return;
  }

  // Process this text file into a list of URL jobs, and enqueue for download
  const feedJobs = processFeedUrls(lines);

  enqueueFeedJobs(feedJobs)
    .then(() => {
      feedWorker.start();
    })
    .catch(error => {
      log.error(error);
    });
});
