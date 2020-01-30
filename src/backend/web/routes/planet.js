const express = require('express');

const { getPosts, getFeeds } = require('../../utils/storage');
const Post = require('../../data/post');
const Feed = require('../../data/feed');
const { logger } = require('../../utils/logger');

const router = express.Router();

// Format a Date into a String like `Saturday, September 17, 2016`
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get most recent 50 posts, and group them according to
 * day, channel, date.
 */
async function getPostDataGrouped() {
  const ids = await getPosts(0, 50);
  const posts = await Promise.all(ids.map(id => Post.byId(id)));

  // We group the posts into nested objects: days > authors > posts
  const grouped = { days: {} };
  posts.forEach(post => {
    if (!post) {
      return;
    }

    // Top level is formated Day strings
    const formatted = formatDate(post.updated);
    if (!grouped.days[formatted]) {
      grouped.days[formatted] = {};
    }

    // Days contain Author strings
    const day = grouped.days[formatted];
    if (!day[post.author]) {
      day[post.author] = {};
    }

    // Authors contain guid strings, which are references to post Objects
    const author = day[post.author];
    if (!author[post.guid]) {
      author[post.guid] = post;
    }
  });

  return grouped;
}

async function getFeedData() {
  const feedIds = await getFeeds();
  const feeds = await Promise.all(feedIds.map(Feed.byId));
  return feeds.sort((a, b) => {
    if (a.author < b.author) return -1;
    if (a.author > b.author) return 1;
    return 0;
  });
}

router.get('/', async (req, res) => {
  try {
    const [grouped, feeds] = await Promise.all([getPostDataGrouped(), getFeedData()]);
    res.render('planet', { feeds, ...grouped });
  } catch (err) {
    logger.error({ err }, 'Error processing posts from Redis');
    res.status(503).json({
      message: `Error processing posts: ${err.message}`,
    });
  }
});

router.get('/compare', (req, res) => {
  res.render('compare-planets');
});

module.exports = router;
