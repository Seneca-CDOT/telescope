const { logger } = require('@senecacdot/satellite');
const { feedQueue } = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { loadFeedsIntoQueue, invalidateFeed } = require('./parser');

/**
 * When the feed queue is drained (all feeds are processed in the queue),
 * restart the process again, and repeat forever.
 */
feedQueue.on('drained', loadFeedsIntoQueue);

/**
 * If there is a failure in the queue for a job, set the feed to invalid
 * and save to Redis
 */
feedQueue.on('failed', (job, err) =>
  invalidateFeed(job.data.id, err).catch((error) =>
    logger.error({ error }, 'Unable to invalidate feed')
  )
);

/**
 * Also load all feeds now and begin processing.
 */
loadFeedsIntoQueue();
feedWorker.start();
