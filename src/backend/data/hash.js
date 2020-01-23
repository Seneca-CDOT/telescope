const crypto = require('crypto');

/**
 * Hash function used to generate our unique data ids.
 * We use sha256 and encode in base64, for example:
 *
 *   6Xoj0UXOW3FNirlSYranli5gY6dDq60hs24EIAcHAEc=
 *
 * but truncate to only use the first 10 characters
 * in order to reduce key sizes in Redis:
 *
 *   6Xoj0UXOW3
 *
 * This is fine for our needs, as we don't have enough
 * data to require the entire hash.
 */
module.exports = input =>
  crypto
    .createHash('sha256')
    .update(input)
    .digest('base64')
    .slice(0, 10);
