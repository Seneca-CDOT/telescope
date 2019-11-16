const Bull = require('bull');
const { setQueues } = require('bull-board');
const parentLogger = require('../utils/logger');

const log = parentLogger.child({ module: 'feed-queue' });

require('./config');

/**
 * Function to log all events in the feed queue
 */
function watch(feedQueue) {
  feedQueue
    .on('error', (error) => {
      // An error occured
      log.error(`Queue ${feedQueue.name} error:`, error, ' Stack: ', error.stack);
    })
    .on('waiting', (jobID) => {
      // A job is waiting for the next idling worker
      log.info(`Job ${jobID} is waiting.`);
    })
    .on('active', (job) => {
      // A job has started (use jobPromise.cancel() to abort it)
      log.info(`Job ${job.id} is active`);
    })
    .on('stalled', (job) => {
      // A job was marked as stalled. This is useful for debugging
      // which workers are crashing or pausing the event loop
      log.info(`Job ${job.id} has stalled.`);
    })
    .on('progress', (job, progress) => {
      // A job's progress was updated
      log.info(`Job ${job.id} progress:`, progress);
    })
    .on('completed', (job) => {
      // A job has been completed
      log.info(`Job ${job.id} completed.`);
    })
    .on('failed', (job, err) => {
      // A job failed with an error
      log.error(`Job ${job.id} failed:`, err);
    })
    .on('paused', (job) => {
      // The queue was paused
      log.info(`Queue ${feedQueue.name} resumed. ID:`, job.id);
    })
    .on('resumed', (job) => {
      // The queue resumed
      log.info(`Queue ${feedQueue.name} resumed. ID: `, job.id);
    })
    .on('cleaned', (jobs, types) => {
      // Old jobs were cleaned from the queue
      // 'Jobs' is an array of cleaned jobs
      // 'Types' is an array of their types
      log.info(`Queue ${feedQueue.name} was cleaned. Jobs: `, jobs, ' Types: ', types);
    })
    .on('drained', () => {
      // The queue was drained
      // (the last item in the queue was returned by a worker)
      log.info(`Queue ${feedQueue.name} was drained.`);
    })
    .on('removed', (job) => {
      log.info(`Job ${job.id} was removed.`);
    });
}

// For visualizing queues using bull board
const queue = new Bull('feed-queue', process.env.REDIS_URL);
watch(queue);
setQueues(queue);

module.exports = queue;
