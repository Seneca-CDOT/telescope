/**
 * Returns whether or not the blog should be marked as inactive
 * Criteria for filtering (in milliseconds) is based on filters.json under blog.inactive
 */
const fs = require('fs');
const { parse } = require('feedparser-promised');

require('../lib/config.js');
const { logger } = require('./logger');

const fsPromises = fs.promises;
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
 * Checks if feed url is redlisted
 * @param {string} feedUrl - url of the feed to check against redlist
 * @param {string} [redlistPath=feeds-redlist.json] - path to JSON file storing non-active feeds
 */
async function check(feedUrl, redlistPath = 'feeds-redlist.json') {
  // Read redlist file
  return fsPromises
    .readFile(redlistPath, 'utf-8')
    .then(redListRaw => {
      // Concat to array no matter what
      const redList = [].concat(JSON.parse(redListRaw));
      return Promise.resolve(redList.some(isRedlisted.bind(null, feedUrl)));
    })
    .catch(error => {
      log.error({ error }, `failed to read ${redlistPath}`);
      return Promise.reject(error);
    });
}

/**
 * Performs a separate sweep of all feeds to see which ones are inactive,
 * then updates last post date in feeds-redlist.json
 *
 * Integration with system can be improved once feed-worker is augmented to
 * pass feed data more intuitively
 *
 * Due to amount of operations, this can be run periodically instead of with every feed update
 * @param {string} [feedsPath=feeds.txt] - path to .txt file storing active feeds
 * @param {string} [redlistPath=feeds-redlist.json] - path to JSON file storing non-active feeds
 * @param {function} [parser=feedParser] - reference to the function used to parse feeds
 */
async function update(feedsPath = 'feeds.txt', redlistPath = 'feeds-redlist.json', parser = parse) {
  if (!feedsPath || !redlistPath) {
    return Promise.reject(new Error('failed to update: bad filepath'));
  }

  // Read the feeds list file
  return fsPromises.readFile(feedsPath, 'utf-8').then(async lines => {
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
      const feed = await parser(feedItem);
      const feedUrl = feedItem.url;

      let recentPostDate = new Date();

      if (feed && typeof feed[0] !== 'undefined') {
        recentPostDate = new Date(feed[0].date);

        // Check if the blog is inactive
        // We convert the dateDiff(result) from ms in days
        const timeDiff = Math.ceil(dateDiff(recentPostDate) / (1000 * 3600 * 24));

        // BLOG_INACTIVE_TIME is supplied with a necessary default value, e.g. of 365 days
        // See: https://github.com/Seneca-CDOT/telescope/issues/396
        if (timeDiff > (process.env.BLOG_INACTIVE_TIME || 365)) {
          log.info(`Blog at: ${feedUrl} is INACTIVE!`);

          redlistUpdate.push({
            url: feedUrl,
            lastUpdate: feed[0].date,
          });
        }
      } else {
        // In case of invalid/ dead feeds
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

        await fsPromises
          .writeFile(redlistPath, rlData)
          .then(() => {
            log.info(`wrote to ${redlistPath}: ${rlData}`);
          })
          .catch(error => {
            log.error({ error }, `Cannot write to file ${redlistPath} `);
            throw error;
          });
      }
    });

    return Promise.resolve(redlistUpdate);
  });
}

exports.check = check;
exports.update = update;
exports.dateDiff = dateDiff;
