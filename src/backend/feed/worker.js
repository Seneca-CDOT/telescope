require('../lib/config');
const { cpus } = require('os');
const path = require('path');

const feedQueue = require('./queue');
const { logger } = require('../utils/logger');
const { checkConnection } = require('../lib/elastic');

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

exports.start = async function() {
  /**
   * Elasticsearch needs time after deployment for setting up all its components.
   * Here we set a timer using 'setTimeout' and check for connectivity during the countdown so elasticsearch
   * has time to be fully prepared to start indexing posts.
   */
  const DELAY = process.env.ELASTIC_DELAY_MS || 10000;
  let intervalId;
  let timerId;

  const timer = new Promise((resolve, reject) => {
    timerId = setTimeout(reject, DELAY);
  });

  const connectivity = new Promise(resolve => {
    intervalId = setInterval(() => {
      checkConnection()
        .then(resolve)
        .catch(() => logger.info('Attempting to connect to elasticsearch...'));
    }, 500);
  });

  try {
    await Promise.race([timer, connectivity]);
    logger.info('Connected to elasticsearch!');
  } catch (error) {
    logger.error(
      `Unable to connect to Elasticsearch before deployment, some posts might not have been indexed: ${error}`
    );
  }
  clearInterval(intervalId);
  clearTimeout(timerId);

  const concurrency = getFeedWorkersCount();
  logger.info(`Starting ${concurrency} instance${concurrency > 1 ? 's' : ''} of feed processor.`);
  feedQueue.process(concurrency, path.resolve(__dirname, 'processor.js'));
  return feedQueue;
};
