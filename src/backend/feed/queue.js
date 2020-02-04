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
queue.addFeed = async function(feed) {
  const options = {
    // Override the Job ID to use the feed id, so we don't duplicate jobs.
    // Bull will not add a job if there already exists a job with the same id.
    jobId: feed.id,
    attempts: process.env.FEED_QUEUE_ATTEMPTS || 5,
    backoff: {
      type: 'exponential',
      delay: process.env.FEED_QUEUE_DELAY_MS || 60 * 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  };

  try {
    await queue.add(feed, options);
  } catch (error) {
    logger.error({ error }, `Unable to add job for ${feed.url} to queue`);
  }
};

module.exports = queue;
