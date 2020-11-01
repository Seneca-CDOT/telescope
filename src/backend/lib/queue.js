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
 * Tracks whether an informative message has been logged following a Redis connection failure
 */
let redisConnectionRefusalLogged = false;

/**
 * Create a Queue with the given `name` (String).
 * We create a Bull Queue using either a real or mocked
 * redis, and manage the creation of the redis connections.
 * We also setup logging for this queue name.
 */
function createQueue(name) {
  const queue = new Bull(name, {
    createClient: (type) => {
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
    .on('error', (error) => {
      // An error occurred
      if (error.code === 'ECONNREFUSED' && !redisConnectionRefusalLogged) {
        logger.error(
          '\n\n\t💡  It appears that Redis is not running on your machine.',
          '\n\t   Please see our documentation for how to install and run Redis:',
          '\n\t   https://github.com/Seneca-CDOT/telescope/blob/master/docs/CONTRIBUTING.md\n'
        );
        redisConnectionRefusalLogged = true;
      } else {
        logger.error({ error }, `Queue ${name} error`);
      }
    })
    .on('waiting', (jobID) => {
      // A job is waiting for the next idling worker
      logger.debug(`Job ${jobID} is waiting.`);
    })
    .on('active', (job) => {
      // A job has started (use jobPromise.cancel() to abort it)
      logger.debug(`Job ${job.id} is active`);
    })
    .on('stalled', (job) => {
      // A job was marked as stalled. This is useful for debugging
      // which workers are crashing or pausing the event loop
      logger.debug(`Job ${job.id} has stalled.`);
    })
    .on('progress', (job, progress) => {
      // A job's progress was updated
      logger.debug(`Job ${job.id} progress:`, progress);
    })
    .on('completed', (job) => {
      // A job has been completed
      logger.debug(`Job ${job.id} completed.`);
    })
    .on('failed', (job, error) => {
      // A job failed with an error
      logger.error({ error }, `Job ${job.id} failed.`);
    })
    .on('paused', () => {
      // The queue was paused
      logger.debug(`Queue ${name} paused.`);
    })
    .on('resumed', (job) => {
      // The queue resumed
      logger.debug(`Queue ${name} resumed. ID: ${job.id}`);
    })
    .on('cleaned', (jobs, types) => {
      // Old jobs were cleaned from the queue
      // 'Jobs' is an array of cleaned jobs
      // 'Types' is an array of their types
      logger.debug(`Queue ${name} was cleaned. Jobs: `, jobs, ' Types: ', types);
    })
    .on('drained', () => {
      // The queue was drained
      // (the last item in the queue was returned by a worker)
      logger.debug(`Queue ${name} was drained.`);
    })
    .on('removed', (job) => {
      logger.debug(`Job ${job.id} was removed.`);
    });

  return queue;
}

module.exports = {
  createQueue,
};
