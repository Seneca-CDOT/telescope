const Bull = require('bull');
const { createRedisClient } = require('./redis');
const { logger } = require('../utils/logger');

/**
 * Shared redis connections for pub/sub, see:
 * https://github.com/OptimalBits/bull/blob/28a2b9aa444d028fc5192c9bbdc9bb5811e77b08/PATTERNS.md#reusing-redis-connections
 */

const client = createRedisClient();
const subscriber = createRedisClient();

/**
 * Create a Queue with the given `name` (String).
 * We create a Bull Queue using either a real or mocked
 * redis, and manage the creation of the redis connections.
 * We also setup logging for this queue name.
 */
function createQueue(name) {
  const log = logger.child({ module: `queue:${name}` });
  const queue = new Bull(name, {
    createClient: type => {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return createRedisClient();
      }
    },
  })
    .on('error', err => {
      // An error occurred
      log.error({ err }, `Queue ${name} error`);
    })
    .on('waiting', jobID => {
      // A job is waiting for the next idling worker
      log.info(`Job ${jobID} is waiting.`);
    })
    .on('active', job => {
      // A job has started (use jobPromise.cancel() to abort it)
      log.info(`Job ${job.id} is active`);
    })
    .on('stalled', job => {
      // A job was marked as stalled. This is useful for debugging
      // which workers are crashing or pausing the event loop
      log.info(`Job ${job.id} has stalled.`);
    })
    .on('progress', (job, progress) => {
      // A job's progress was updated
      log.info(`Job ${job.id} progress:`, progress);
    })
    .on('completed', job => {
      // A job has been completed
      log.info(`Job ${job.id} completed.`);
    })
    .on('failed', (job, err) => {
      // A job failed with an error
      log.error(`Job ${job.id} failed:`, err);
    })
    .on('paused', job => {
      // The queue was paused
      log.info(`Queue ${name} resumed. ID:`, job.id);
    })
    .on('resumed', job => {
      // The queue resumed
      log.info(`Queue ${name} resumed. ID: `, job.id);
    })
    .on('cleaned', (jobs, types) => {
      // Old jobs were cleaned from the queue
      // 'Jobs' is an array of cleaned jobs
      // 'Types' is an array of their types
      log.info(`Queue ${name} was cleaned. Jobs: `, jobs, ' Types: ', types);
    })
    .on('drained', () => {
      // The queue was drained
      // (the last item in the queue was returned by a worker)
      log.info(`Queue ${name} was drained.`);
    })
    .on('removed', job => {
      log.info(`Job ${job.id} was removed.`);
    });

  return queue;
}

module.exports = {
  createQueue,
};
