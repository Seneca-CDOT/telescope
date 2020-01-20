#!/usr/bin/env node

require('../src/backend/lib/config');

const args = require('minimist')(process.argv.slice(2));
const isValidUrl = require('valid-url');

const { logger } = require('../src/backend/utils/logger');
const feedQueue = require('../src/backend/feed/queue');

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

  const feedInfo = { name, url };

  try {
    await feedQueue.addFeed(feedInfo);
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}
add();
