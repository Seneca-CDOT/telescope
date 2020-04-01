const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { isWebUri } = require('valid-url');

require('../lib/config');
const { logger } = require('./logger');

const { JSDOM } = jsdom;

/*
 * getData() returns Promise { <pending> }
 * It gets the data from 'pre' tag in a provided url
 * Splits the data into lines so its easier to process as a string array
 * That data is then returned as a Promise
 */
async function getWikiText(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();

    const dom = new JSDOM(data);
    return dom.window.document.querySelector('pre').textContent;
  } catch (error) {
    logger.error({ error }, `Unable to download wiki feed data from url ${url}`);
    throw error;
  }
}

/*
 * Returns a Promise { <pending> }
 * It downloads the feed data from the Wiki, then processes it into an
 * Array of feed Objects of the following form:
 *
 * {
 *   name: "name of user",
 *   url: "feed url of user"
 * }
 */
module.exports = async function () {
  let url = process.env.FEED_URL;
  const interval = process.env.FEED_URL_INTERVAL_MS || 30000;

  if (!url) {
    url = 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List';
    logger.debug(`No value found for FEED_URL in env, using default ${url} instead`);
  }

  const nameCheck = /^\s*name/i;
  const commentCheck = /^\s*#/;

  /**
   * Try to fetch the feed list from 'url'.
   * If not available, keep trying every 'interval' milliseconds.
   */
  let intervalId;
  const downloadFeedList = new Promise(resolve => {
    intervalId = setInterval(() => {
      getWikiText(url)
        .then(resolve)
        .catch(error => logger.info({ error }));
    }, interval);
  });

  const wikiText = await downloadFeedList;

  clearInterval(intervalId);

  const lines = wikiText.split(/\r\n|\r|\n/);
  const feeds = [];
  let currentFeedInfo = {};

  // Iterate through all lines and find url/name pairs, then add to feeds array.
  lines.forEach((line) => {
    if (commentCheck.test(line)) {
      // skip comments
      return;
    }

    // Is this a feed URL?
    if (line.startsWith('[')) {
      currentFeedInfo.url = line.replace(/[[\]']/g, '');
    } // Is this an author's name?
    else if (nameCheck.test(line)) {
      currentFeedInfo.author = line.replace(/^\s*name\s*=\s*/, '');

      // The name will follow the URL that goes with it, so add this feed now
      // Make sure the URL for this feed is a valid http/https web URI,
      // then process into a Feed object.
      if (!isWebUri(currentFeedInfo.url)) {
        logger.info(
          `Skipping invalid wiki feed url ${currentFeedInfo.url} for author ${currentFeedInfo.author}`
        );
      } else {
        feeds.push(currentFeedInfo);
      }

      currentFeedInfo = {};
    }
  });

  return feeds;
};
