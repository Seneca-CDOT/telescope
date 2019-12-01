/**
 * Returns whether or not the blog should be marked as inactive
 * Criteria for filtering (in milliseconds) is based on filters.json under blog.inactive
 */
require('../lib/config.js');
const fs = require('fs');
const feedParser = require('../feed/parser');
const { logger } = require('./logger');

const log = logger.child({ module: 'inactive-blog-filter' });

/**
 * Condition for passing redlist some() check
 * @param {string} feedUrl - url of the feed to check against redlist
 * @param {Object} redItem - object containing a redlist entry
 * @returns {boolean} - bool value
 */
function isRedlisted(feedUrl, redItem) {
  return feedUrl === redItem.url;
}

/**
 * Simple function that takes the difference between current date and post date
 * If difference is greater than threshold, the blog is considered inactive
 * @param {Date} postDate - javascript date object of the post being checked
 * @returns {number} - date difference in milliseconds
 */
function dateDiff(postDate) {
  const currentDate = new Date();
  return currentDate - postDate;
}

/**
 * Callback for redlist check
 * @callback checkCallback
 * @param {boolean} result - true/false whether or not a feed url is redlisted
 */

/**
 * Checks if feed url is redlisted
 * @param {string} feedUrl - url of the feed to check against redlist
 * @param {checkCallback} callback - a callback that runs after the check
 */
function check(feedUrl, callback) {
  // Read redlist file
  fs.readFile('feeds-redlist.json', 'utf-8', (err, redListRaw) => {
    if (err) {
      // Error reading file
      callback(err, false);
      return;
    }

    if (redListRaw.length === 0) {
      // File is empty
      callback(undefined, false);
      return;
    }

    // Concat to array no matter what
    const redList = [].concat(JSON.parse(redListRaw));

    callback(null, redList.some(isRedlisted.bind(null, feedUrl)));
  });
}

/*
 * Performs a separate sweep of all feeds to see which ones are inactive,
 * then updates last post date in feeds-redlist.json
 *
 * Integration with system can be improved once feed-worker is augmented to
 * pass feed data more intuitively
 *
 * Due to amount of operations, this can be run periodically instead of with every feed update
 */
function update() {
  // Read the feeds list file
  fs.readFile('feeds.txt', 'utf8', (err, lines) => {
    if (err) {
      log.error('unable to read initial list of feeds, cannot update', err.message);
      return;
    }

    // Divide the file into separate lines
    const feedUrlList = lines
      .split(/\r?\n/)
      // Basic filtering to remove any ines that don't look like a feed URL
      .filter(line => line.startsWith('http'))
      // Convert this into an Object of the form expected by our queue
      .map(url => ({ url }));

    const redlistUpdate = [];
    let linesRead = 0;

    feedUrlList.forEach(async feedItem => {
      const feed = await feedParser(feedItem);
      const feedUrl = feedItem.url;

      let recentPostDate = new Date();

      // In case of invalid/ dead feeds
      if (typeof feed[0] !== 'undefined') {
        recentPostDate = new Date(feed[0].date);

        // Check if the blog is inactive
        // We convert the dateDiff(result) from ms in days
        const timeDiff = Math.ceil(dateDiff(recentPostDate) / (1000 * 3600 * 24));

        if (timeDiff > process.env.BLOG_INACTIVE_TIME) {
          log.info(`Blog at: ${feedUrl} is INACTIVE!`);

          redlistUpdate.push({
            url: feedUrl,
            lastUpdate: feed[0].date,
          });
        }
      } else {
        log.info(`Blog at: ${feedUrl} HAS NOTHING TO SHARE!`);

        redlistUpdate.push({
          url: feedUrl,
          lastUpdate: null,
        });
      }

      // Use a counter to ensure all feeds are processed before writing redlist
      linesRead += 1;

      if (linesRead === feedUrlList.length) {
        // Write the new feeds-redlist.json
        const rlData = JSON.stringify(redlistUpdate, null, 2);

        fs.writeFile('feeds-redlist.json', rlData, werr => {
          if (werr) {
            log.error('unable to write to feeds-redlist.json, cannot update', err.message);
            return;
          }

          log.info('wrote to feeds-redlist.json');
        });
      }
    });
  });
}

exports.check = check;
exports.update = update;
exports.dateDiff = dateDiff;
