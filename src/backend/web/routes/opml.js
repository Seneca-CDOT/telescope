const express = require('express');
const opml = require('opml-generator');
const { getFeeds } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const Feed = require('../../data/feed');

const router = express.Router();

const header = {
  title: 'OPML Feeds',
  dateCreated: new Date(),
  ownerName: 'Telescope',
};

router.get('/', async (req, res) => {
  let feeds;
  try {
    feeds = await Promise.all((await getFeeds()).map(Feed.byId));
  } catch (error) {
    logger.error({ error }, 'Failed to get feeds from Redis storage');
  }
  const outlines = feeds.map(feed => {
    return {
      text: feed.id,
      title: `${feed.author}'s blog`,
      type: feed.url.includes('atom') ? 'atom' : 'rss',
      xmlUrl: feed.url,
      htmlUrl: new URL(feed.url).origin,
    };
  });
  // call the opml() function here, and return it on res, using the correct content-type of " text/x-opml"
  res.setHeader('Content-type', 'text/x-opml');
  res.send(opml(header, outlines));
});

module.exports = router;
