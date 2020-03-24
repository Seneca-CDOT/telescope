#!/usr/bin/env node

require('../src/backend/lib/config');

const args = require('minimist')(process.argv.slice(2));
const isValidUrl = require('valid-url');

const Feed = require('../src/backend/data/feed');
const { logger } = require('../src/backend/utils/logger');

const log = logger.child({ module: 'add-feed' });

async function add() {
  if (
    !Object.prototype.hasOwnProperty.call(args, 'name') ||
    !Object.prototype.hasOwnProperty.call(args, 'url')
  ) {
    log.error('Usage: add-feed --name <name of the blog author> --url <the feed of the url>');
    process.exit(1);
  }
  const { name, url, link } = args;
  if (!isValidUrl(url)) {
    log.error('INVALID URL');
    process.exit(1);
  }

  try {
    await Feed.create({ author: name, url, link });
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}
add();
