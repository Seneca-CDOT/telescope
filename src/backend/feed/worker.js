const { cpus } = require('os');
const path = require('path');

const feedQueue = require('./queue');
const { logger } = require('../utils/logger');

/**
 * We determine the number of parallel feed processor functions to run
 * based on the value of the environment variable FEED_QUEUE_PARALLEL_WORKERS.
 * Possible values are:
 *
 *  *: use the number of available CPUs
 *  <a Number>: use the given number, up to the number of available CPUs
 *  <not set>: use 1 by default
 */
function getFeedWorkersCount() {
  const { FEED_QUEUE_PARALLEL_WORKERS } = process.env;
  const cpuCount = cpus().length;

  if (FEED_QUEUE_PARALLEL_WORKERS === '*') {
    return cpuCount;
  }

  const count = Number(FEED_QUEUE_PARALLEL_WORKERS) || 1;
  return Math.min(count, cpuCount);
}

exports.start = function() {
  const concurrency = getFeedWorkersCount();
  logger.info(`Starting ${concurrency} instance${concurrency > 1 ? 's' : ''} of feed processor.`);
  feedQueue.process(concurrency, path.resolve(__dirname, 'processor.js'));
  return feedQueue;
};
