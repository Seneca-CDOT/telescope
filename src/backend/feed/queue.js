const { setQueues } = require('bull-board');

require('../lib/config');
const { logger } = require('../utils/logger');
const { createQueue } = require('../lib/queue');

// Create a Bull Redis Queue
const queue = createQueue('feed-queue');

// For visualizing queues using bull board
setQueues(queue);

/**
 * Provide a helper for adding a feed with our desired default options.
 * The `feedInfo` is an Object with `name` (i.e., name of author) and `url`
 * (i.e., url of feed) properties, matching what we parse from the wiki.
 */
queue.addFeed = async function(feedInfo) {
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
    await queue.add(feedInfo, options);
  } catch (err) {
    logger.error({ err, feedInfo }, 'Unable to add job to queue');
  }
};

module.exports = queue;
