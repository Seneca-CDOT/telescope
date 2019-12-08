const express = require('express');

const { getPosts } = require('../../utils/storage');
const Post = require('../../post');
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
  const posts = await Promise.all(ids.map(id => Post.byGuid(id)));

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

router.get('/', async (req, res) => {
  try {
    const grouped = await getPostDataGrouped();
    res.render('planet', grouped);
  } catch (err) {
    logger.error({ err }, 'Error processing posts from Redis');
    res.status(503).json({
      message: `Error processing posts: ${err.message}`,
    });
  }
});

module.exports = router;
