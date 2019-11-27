require('../lib/config');

const args = require('minimist')(process.argv.slice(2));
const { logger } = require('./logger');
const { isValidUrl } = require('./utils');
const { addFeed } = require('../utils/storage');
// const validator = require('validator');

const log = logger.child({ module: 'add-feed' });

async function add() {
  console.log('ARGS', args);
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

  addFeed(cleanName, url).catch(e => log.error(e));
  log.info('feed added');
}
add();
