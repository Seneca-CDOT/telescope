const extractGitHubInfo = require('./extract-github-info');
const htmlToUrls = require('./html-to-urls');

/**
 * @typedef {Object} GitHubInfo
 * @property {string[]} issues
 * @property {string[]} pullRequests
 * @property {string[]} repos
 * @property {string[]} commits
 * @property {string[]} users
 */

/**
 * Extract all GitHub URL info from an HTML string
 * @param {string} htmlString - a string of HTML
 * @param {DOMParser} [parser] - an HTML DOM Parser
 * @returns {GitHubInfo}
 */
module.exports = (htmlString, parser) => {
  if (!parser && !('DOMParser' in globalThis)) {
    throw new Error('Missing parser property and environment does not support DOMParser');
  }

  const urls = htmlToUrls(htmlString, parser || new globalThis.DOMParser());
  return extractGitHubInfo(urls);
};
