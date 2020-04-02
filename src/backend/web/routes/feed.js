/**
 * The /feed route provides various types of feeds for Telescope content
 * itself, including:
 *
 * - OPML, for the exporting the feed list
 * - RSS, ATOM, and JSON, for getting a feed of posts
 */

const express = require('express');
const opml = require('opml-generator');
const { Feed: FeedMeta } = require('feed');

const { getFeeds, getPosts } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const Feed = require('../../data/feed');
const Post = require('../../data/post');

const { API_URL } = process.env;

const router = express.Router();

// Get all feed objects from Redis, returns a Promise
const allFeeds = async () => Promise.all((await getFeeds()).map(Feed.byId));

/**
 * Generate an express route for returning a feed type.
 * @param {String} type is the feed type, one of 'rss', 'json', or 'atom'
 */
const feedRoute = (type) => async (req, res) => {
  const feed = new FeedMeta({
    title: 'Telescope',
    description: "The Seneca College open source community's blog feed",
    id: API_URL,
    link: `${API_URL}/feed/${type}`,
    language: 'en',
    // TODO: https://github.com/Seneca-CDOT/telescope/issues/637
    // image: 'http://example.com/image.png',
    // favicon: 'http://example.com/favicon.ico',
    copyright: 'Copyright original authors',
    feedLinks: {
      rss: `${API_URL}/feed/rss`,
      json: `${API_URL}/feed/json`,
      atom: `${API_URL}/feed/atom`,
    },
  });

  // Get the last 50 posts from Redis
  let posts;
  try {
    const ids = await getPosts(0, 50);
    posts = await Promise.all(ids.map(Post.byId));
  } catch (err) {
    logger.error({ err }, 'Error processing posts from Redis');
    res.status(503).send({
      message: `Error processing posts: ${err.message}`,
    });
    return;
  }

  // Convert these posts to "feed" objects and add to our outgoing feed
  posts.forEach((post) =>
    feed.addItem({
      title: post.title,
      id: post.id,
      link: post.url,
      description: post.text,
      content: post.html,
      author: [
        {
          name: post.feed.author,
          // TODO: add site info for this feed https://github.com/Seneca-CDOT/telescope/issues/724
        },
      ],
      date: post.updated,
      // TODO: https://github.com/Seneca-CDOT/telescope/issues/539
      // image: post.image,
    })
  );

  feed.addCategory('Open Source');
  feed.addCategory('Technology');

  switch (type) {
    case 'rss': // RSS 2.0
      res.setHeader('Content-type', 'application/rss+xml');
      res.send(feed.rss2());
      break;
    case 'json': // JSON Feed 1.0
      res.setHeader('Content-type', 'application/json');
      res.send(feed.json1());
      break;
    case 'atom': // Atom 1.0
    default:
      res.setHeader('Content-type', 'application/atom+xml');
      res.send(feed.atom1());
      break;
  }
};

/**
 * We support RSS, Atom, and JSON feeds.
 */
router.get('/rss', feedRoute('rss'));
router.get('/atom', feedRoute('atom'));
router.get('/json', feedRoute('json'));

/**
 * Expose our feed list as OPML
 */
router.get('/opml', async (req, res) => {
  const header = {
    title: 'Telescope Feeds',
    dateCreated: new Date(),
    ownerName: 'Telescope',
  };

  let feeds;
  try {
    feeds = await allFeeds();
  } catch (error) {
    logger.error({ error }, 'Failed to get feeds from database');
    res.status(503).send('Failed to get feeds from database');
    return;
  }

  const outlines = feeds.map((feed) => ({
    text: feed.id,
    title: `${feed.author}'s blog`,
    type: feed.url.includes('atom') ? 'atom' : 'rss',
    xmlUrl: feed.url,
    htmlUrl: new URL(feed.url).origin,
  }));

  res.setHeader('Content-type', 'text/x-opml');
  res.send(opml(header, outlines));
});

/**
 * Expose a "feed" of our feeds suitable for the wiki feed list.
 * The wiki feed list uses the following format for a feed:
 *
 *   [http://url.to/blog/feed]
 *   name=Author Name
 */
router.get('/wiki', async (req, res) => {
  let feeds;
  try {
    feeds = await allFeeds();
    const wikiFeedList = feeds.map((feed) => `[${feed.url}]\nname=${feed.author}\n`);

    res.setHeader('Content-type', 'text/plain');
    res.send(wikiFeedList.join('\n'));
  } catch (error) {
    logger.error({ error }, 'Failed to get feeds from database');
    res.status(503).send('Failed to get feeds from database');
  }
});

module.exports = router;
