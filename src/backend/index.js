require('./lib/config.js');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { logger } = require('./utils/logger');
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

/**
 * Add a feed URL job to the queue. It may fail, if there is already
 * a job in the queue with the same URL.
 */
async function addFeedJob(feedInfo) {
  const options = {
    // Use the feed URL as the job key, so we don't double add it.
    // Bull will not add a job there already exists a job with the same id.
    id: feedInfo.url,
    attempts: process.env.FEED_QUEUE_ATTEMPTS || 2,
    backoff: {
      type: 'exponential',
      delay: process.env.FEED_QUEUE_DELAY_MS || 30 * 1000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  };

  try {
    feedQueue.add(feedInfo, options);
  } catch (err) {
    logger.error({ err }, 'Unable to add job to queue');
  }
}

/**
 * Adds feed URL jobs to the feed queue for processing
 * @param {Array[Object]} feedJobs - list of feed URL jobs to be processed
 */
async function enqueueWikiFeed() {
  try {
    const data = await wikiFeed.parseData();
    await Promise.all(data.map(feedInfo => addFeedJob(feedInfo)));
  } catch (err) {
    logger.error({ err }, 'Error queuing wiki feeds');
  }
}

function loadFeedsIntoQueue() {
  logger.info('Loading all feeds into feed queue for processing');
  enqueueWikiFeed().catch(error => {
    logger.error({ error }, 'Unable to enqueue wiki feeds');
  });
}

/**
 * When the feed queue is drained (all feeds are processed in the queue),
 * restart the process again, and repeat forever.
 */
feedQueue.on('drained', loadFeedsIntoQueue);

/**
 * Also load all feeds now and begin processing.
 */
loadFeedsIntoQueue();
feedWorker.start();
