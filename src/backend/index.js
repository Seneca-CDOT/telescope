require('./lib/config.js');
const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { logger } = require('./utils/logger');
const getWikiFeeds = require('./utils/wiki-feed-parser');
const shutdown = require('./lib/shutdown');
const Feed = require('./data/feed');

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
 * Adds the feed to the database if necessary, or gets a more complete
 * version of the feed if we have better data already.
 * @param {Feed} feed - a feed Object parsed from the wiki feed list.
 * Returns the most appropriate Feed Object to use.
 */
async function updateFeed(feed) {
  let currentFeed;

  // If we have an existing feed in the database for this id, prefer that,
  // since it might have updated cache info (e.g., etag)
  const existingFeed = await Feed.byId(feed.id);
  if (existingFeed) {
    // We have a version of this feed in the database already, prefer that
    currentFeed = existingFeed;
  } else {
    // First time we're seeing this feed, add it to the database
    currentFeed = feed;
    await currentFeed.save();
  }

  return currentFeed;
}

/**
 * Invalidates a feed
 * @param feedData - Object containing feed data
 */
// Commented out as of now as it is breaking the staging server. Uncomment
// this block and 109 to enable invalidating feeds
/* async function invalidateFeed(feedData) {
  const feed = Feed.parse(feedData);
  await feed.setInvalid(feedData.reason || 'unknown reason');
  logger.info(
    `Invalidating feed ${feedData.url} for the following reason: ${feedData.reason ||
      'unknown reason'}`
  );
} */

/**
 * Process all of these Feed objects into Redis and the feed queue.
 * @param {Array<Feed>} feeds - the parsed feed Objects to be processed.
 */
function processFeeds(feeds) {
  return Promise.all(
    feeds.map(async feed => {
      // Save this feed into the database if necessary.
      const currentFeed = await updateFeed(feed);
      // Add a job to the feed queue to process all of this feed's posts.
      await feedQueue.addFeed(currentFeed);
    })
  );
}

/**
 * Download and parse feed author/URL info from the wiki, and process
 * these into Feed Objects to be added to the database and feed queue.
 */
async function processWikiFeeds() {
  try {
    // Get an Array of Feed objects from the wiki feed list
    const feeds = await getWikiFeeds();
    // Process these feeds into the database and feed queue
    await processFeeds(feeds);
  } catch (err) {
    logger.error({ err }, 'Error queuing wiki feeds');
  }
}

function loadFeedsIntoQueue() {
  logger.info('Loading all feeds into feed queue for processing');
  processWikiFeeds().catch(error => {
    logger.error({ error }, 'Unable to enqueue wiki feeds');
  });
}

/**
 * When the feed queue is drained (all feeds are processed in the queue),
 * restart the process again, and repeat forever.
 */
feedQueue.on('drained', loadFeedsIntoQueue);

/**
 * If there is a failure in the queue for a job, set the feed to invalid
 * and save to Redis
 */
// Commenting out below for now as it is suspected to be crashing staging server
/* feedQueue.on('failed', job =>
  invalidateFeed(job.data).catch(error => logger.error({ error }, 'Unable to invalidate feed'))
); */

/**
 * Also load all feeds now and begin processing.
 */
loadFeedsIntoQueue();
feedWorker.start();
