const { logger } = require('@senecacdot/satellite');
const { feedQueue } = require('./feed/queue');
const Feed = require('./data/feed');
const { getAllFeeds } = require('./utils/supabase');

/**
 * Adds the feed to the database if necessary, or gets a more complete
 * version of the feed if we have better data already.
 * @param {Object} feedData - feed data parsed from the wiki feed list.
 * Returns Promise<Feed>, with the most appropriate Feed Object to use.
 */
const updateFeed = async (feedData) => {
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
};

/**
 * Invalidates a feed
 * @param feedData - Object containing feed data
 */
const invalidateFeed = async (id, error) => {
  const feed = await Feed.byId(id);
  await feed.setInvalid(error.message);
  logger.info(`Invalidating feed ${feed.url} for the following reason: ${error.message}`);
};

/**
 * Process all of these Feed objects into Redis and the feed queue.
 * @param {Array<Feed>} feeds - the parsed feed Objects to be processed.
 */
const processFeeds = (feeds) => {
  return Promise.all(
    feeds.map(async (feed) => {
      // Save this feed into the database if necessary.
      const currentFeed = await updateFeed(feed);
      // Add a job to the feed queue to process all of this feed's posts.
      await feedQueue.addFeed({ id: currentFeed.id });
    })
  );
};

/**
 * Download and parse feed author/URL info from the wiki and redis, and process
 * these into Feed Objects to be added to the database and feed queue.
 */
const processAllFeeds = async () => {
  try {
    // Get an Array of Feed objects from the wiki feed list and Redis
    const feeds = await getAllFeeds();
    // Process these feeds into the database and feed queue
    await processFeeds(feeds);
  } catch (err) {
    logger.error({ err }, 'Error queuing feeds');
  }
};

/**
 * Also load all feeds now and begin processing.
 */
const loadFeedsIntoQueue = () => {
  logger.info('Loading all feeds into feed queue for processing');
  processAllFeeds().catch((error) => {
    logger.error({ error }, 'Unable to enqueue feeds');
  });
};

module.exports = { loadFeedsIntoQueue, invalidateFeed };
