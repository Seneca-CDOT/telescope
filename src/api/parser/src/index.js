const { Satellite, logger } = require('@senecacdot/satellite');
const { feedQueue } = require('./feed/queue');
const feedWorker = require('./feed/worker');
const { loadFeedsIntoQueue, invalidateFeed } = require('./parser');

const port = parseInt(process.env.PARSER_PORT || 10000, 10);
const service = new Satellite();

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
    logger.error({ error }, `Unable to invalidate feed ${job.data.id}`)
  )
);

/**
 * Start server and load all feeds now and begin processing.
 */
service.start(port, () => {
  loadFeedsIntoQueue();
  feedWorker.start();
});
