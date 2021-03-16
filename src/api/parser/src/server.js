const { logger } = require('@senecacdot/satellite');
const service = require('.');

const port = parseInt(process.env.POSTS_PORT || 5555, 10);

// Start service
service.start(port);

const feedQueue = require('./feed/queue');
const feedWorker = require('./feed/worker');
const getWikiFeeds = require('./utils/wiki-feed-parser');
const Feed = require('./data/feed');

/**
 * Adds the feed to the database if necessary, or gets a more complete
 * version of the feed if we have better data already.
 * @param {Object} feedData - feed data parsed from the wiki feed list.
 * Returns Promise<Feed>, with the most appropriate Feed Object to use.
 */
async function updateFeed(feedData) {
  let currentFeed;

  // If we have an existing feed in the database for this URL, prefer that,
  // since it might have updated cache info (e.g., etag).
  const existingFeed = await Feed.byUrl(feedData.url);
  if (existingFeed) {
    // We have a version of this feed in the database already, prefer that
    currentFeed = existingFeed;
  } else {
    // First time we're seeing this feed, add it to the database
    const id = await Feed.create(feedData);
    currentFeed = await Feed.byId(id);
  }

  return currentFeed;
}

/**
 * Invalidates a feed
 * @param feedData - Object containing feed data
 */
async function invalidateFeed(id) {
  const feed = await Feed.byId(id);
  // TODO: we need to bubble up the reason for the failure
  await feed.setInvalid('unknown reason');
  logger.info(`Invalidating feed ${feed.url} for the following reason: ${'unknown reason'}`);
}

/**
 * Process all of these Feed objects into Redis and the feed queue.
 * @param {Array<Feed>} feeds - the parsed feed Objects to be processed.
 */
function processFeeds(feeds) {
  return Promise.all(
    feeds.map(async (feed) => {
      // Save this feed into the database if necessary.
      const currentFeed = await updateFeed(feed);
      // Add a job to the feed queue to process all of this feed's posts.
      await feedQueue.addFeed({ id: currentFeed.id });
    })
  );
}

/**
 * Download and parse feed author/URL info from the wiki and redis, and process
 * these into Feed Objects to be added to the database and feed queue.
 */
async function processAllFeeds() {
  try {
    // Get an Array of Feed objects from the wiki feed list and Redis
    const [all, wiki] = await Promise.all([Feed.all(), getWikiFeeds()]);
    // Process these feeds into the database and feed queue
    await processFeeds([...all, ...wiki]);
  } catch (err) {
    logger.error({ err }, 'Error queuing feeds');
  }
}

function loadFeedsIntoQueue() {
  logger.info('Loading all feeds into feed queue for processing');
  processAllFeeds().catch((error) => {
    logger.error({ error }, 'Unable to enqueue feeds');
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
feedQueue.on('failed', (job) =>
  invalidateFeed(job.data.id).catch((error) => logger.error({ error }, 'Unable to invalidate feed'))
);

/**
 * Also load all feeds now and begin processing.
 */
loadFeedsIntoQueue();
feedWorker.start();
