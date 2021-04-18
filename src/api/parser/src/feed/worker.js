const { cpus } = require('os');
const path = require('path');

const { logger } = require('@senecacdot/satellite');
const feedQueue = require('./queue');
const { waitOnReady } = require('../utils/indexer');

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

exports.start = async function () {
  try {
    await waitOnReady();
    logger.info('Connected to elasticsearch!');
    const concurrency = getFeedWorkersCount();
    logger.debug(
      `Starting ${concurrency} instance${concurrency > 1 ? 's' : ''} of feed processor.`
    );
    feedQueue.process(concurrency, path.resolve(__dirname, 'processor.js'));
    return feedQueue;
  } catch (error) {
    /**
     * If elasticsearch is not initialized, we throw again to terminate Telescope.
     * According to nodejs.org:
     * "If it is necessary to terminate the Node.js process due to an error condition,
     * throwing an uncaught error and allowing the process to terminate accordingly
     * is safer than calling process.exit()"
     */
    logger.error(error);
    throw error;
  }
};
