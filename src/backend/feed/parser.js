const feedparser = require('feedparser-promised');
const { logger } = require('../utils/logger');

const log = logger.child({ module: 'inactive-blog-filter' });
// feed: url for the feed
// Accepts a url feed and parses it, on success will return an array
module.exports = async function(feed) {
  const result = feedparser.parse(feed);
  await result.then(items => {
    items.forEach(item =>
      log.info(`title: ${item.title}, author: ${item.author}, summary: ${item.summary} `)
    );
  });
  return result;
};
