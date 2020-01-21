const crypto = require('crypto');
const normalizeUrl = require('normalize-url');
const { logger } = require('./logger');

module.exports = (url, type) => {
  let namespace = 't:post:';
  let processed = url;

  if (type === 'feed') {
    namespace = 't:feed:';
    processed = normalizeUrl(url);
  }

  try {
    return namespace.concat(
      crypto
        .createHash('sha256')
        .update(processed)
        .digest('base64')
    );
  } catch (error) {
    logger.error(`There was an error processing ${url}`);
    throw error;
  }
};
