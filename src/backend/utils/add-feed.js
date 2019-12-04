#!/usr/bin/env node

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
    log.error('Usage: add-feed --name <name of the blog author> --url <the feed of the url>');
    process.exit(1);
  }
  const { name, url } = args;
  if (!isValidUrl(url)) {
    log.error('INVALID URL');
    process.exit(1);
  }

  const feed = { name, url };

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
  process.exit(0);
}
add();
