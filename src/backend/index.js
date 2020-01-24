require('./lib/config.js');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { logger } = require('./utils/logger');
const getWikiFeeds = require('./utils/wiki-feed-parser');
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
 * Adds feed URL jobs to the feed queue for processing
 * @param {Array[Object]} feedJobs - list of feed URL jobs to be processed
 */
async function enqueueWikiFeed() {
  try {
    // Get an Array of Feed objects from the wiki feed list
    const feeds = await getWikiFeeds();
    // Process all of these Feed objects into Redis and the feed queue
    await Promise.all(
      feeds.map(feed =>
        Promise.all([
          // Store this feed in Redis
          feed.save(),
          // Add a job to the feed queue to process all of its posts
          feedQueue.addFeed(feed),
        ])
      )
    );
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
