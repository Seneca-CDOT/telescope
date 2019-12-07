require('./lib/config.js');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const textParser = require('./utils/text-parser');
const { logger: log } = require('./utils/logger');
const wikiFeed = require('./utils/wiki-feed-parser');
const shutdown = require('./lib/shutdown');

// Start the web server
require('./web/server');

/**
 * Shutting Down Logic for most Server Shutdown Cases
 */
process.on('exit', shutdown('exit'));
process.on('SIGTERM', shutdown('SIGTERM'));
process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGQUIT', shutdown('SIGQUIT'));
process.on('unhandledRejection', shutdown('UNHANDLED REJECTION'));
process.on('uncaughtException', shutdown('UNCAUGHT EXCEPTION'));

textParser
  .initialize()
  .then(() => {
    log.info('Successfully initialized text parser');
  })
  .catch(error => {
    log.error({ error }, 'Unable to initialize text parser');
  });

/**
 * Adds feed URL jobs to the feed queue for processing
 * @param {Array[Object]} feedJobs - list of feed URL jobs to be processed
 */
async function enqueueWikiFeed() {
  const data = await wikiFeed.parseData();
  await Promise.all(
    data.map(feedJob =>
      feedQueue.add(feedJob, {
        attempts: process.env.FEED_QUEUE_ATTEMPTS || 8,
        backoff: {
          type: 'exponential',
          delay: process.env.FEED_QUEUE_DELAY_MS || 60 * 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      })
    )
  ).catch(err => log.error({ err }, 'Error queuing wiki feeds'));
}

enqueueWikiFeed()
  .then(() => {
    feedWorker.start();
  })
  .catch(error => {
    log.error({ error }, 'Unable to enqueue wiki feeds');
  });
