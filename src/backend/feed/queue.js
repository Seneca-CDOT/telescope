const { setQueues, BullAdapter } = require('bull-board');

require('../lib/config');
const { logger } = require('../utils/logger');
const { createQueue } = require('../lib/queue');

// Create a Bull Redis Queue
const queue = createQueue('feed-queue');

// For visualizing queues using bull board
setQueues([new BullAdapter(queue)]);

/**
 * Provide a helper for adding a feed with our desired default options.
 * The `job` contains an `id`, which refers to a Feed Object `id` already in Redis.
 */
queue.addFeed = async function (job) {
  const options = {
    // Override the Job ID to use the feed id, so we don't duplicate jobs.
    // Bull will not add a job if there already exists a job with the same id.
    jobId: job.id,
    attempts: process.env.FEED_QUEUE_ATTEMPTS || 5,
    backoff: {
      type: 'exponential',
      delay: process.env.FEED_QUEUE_DELAY_MS || 60 * 1000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  };

  try {
    await queue.add(job, options);
  } catch (error) {
    logger.error({ error }, `Unable to add job for id=${job.id} to queue`);
  }
};

module.exports = queue;
