require('../lib/config');

const args = require('minimist')(process.argv.slice(2));
const { logger } = require('./logger');
const { isValidUrl } = require('./utils');
const feedQueue = require('../feed/queue');

const log = logger.child({ module: 'add-feed' });

async function add() {
  if (
    !Object.prototype.hasOwnProperty.call(args, 'name') ||
    !Object.prototype.hasOwnProperty.call(args, 'url')
  ) {
    log.error('INVALID NUMBER OF ARGUMENTS');
    process.exit(1);
  }
  const { name, url } = args;
  if (!isValidUrl(url)) {
    log.error('INVALID URL');
    process.exit(1);
  }
  const cleanName = String(name);
  if (cleanName.match(/[.*+?^${}()|[\]\\`]/)) {
    log.error('ONLY ALPHANUMERICAL CHARACTERS ALLOWED');
    process.exit(1);
  }

  const feed = { name, url };

  log.info(`Enqueuing feed job for ${url}`);
  await feedQueue
    .add(feed, {
      attempts: process.env.FEED_QUEUE_ATTEMPTS || 8,
      backoff: {
        type: 'exponential',
        delay: process.env.FEED_QUEUE_DELAY_MS || 60 * 1000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    })
    .catch(err => {
      log.error({ err }, 'Error enqueuing feed');
      process.exit(1);
    });
  log.info('feed added');
  process.exit(0);
}
add();
