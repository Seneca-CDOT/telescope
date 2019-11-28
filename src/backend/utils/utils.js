/**
 * Generic and utilities functions
 */
const validUrl = require('valid-url');

/**
 * Check if URL is valid.
 * @param {String} url
 * @returns {boolean} true if url is valid. false if url address contains errors
 */
function isValidUrl(url) {
  let isValid = false;
  if (validUrl.isUri(url)) {
    isValid = true;
  }
  return isValid;
}

module.exports = { isValidUrl };
