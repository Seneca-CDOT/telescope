const { Router, logger, fetch } = require('@senecacdot/satellite');
const router = Router();

const { POSTS_URL } = process.env;
const FEEDS_URL = `${POSTS_URL}/feeds`;

// Format a Date into a String like `Saturday, September 17, 2016`
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get most recent 50 posts, and group them according to
 * day, channel, date.
 */
const getPostDataGrouped = (posts) => {
  // We group the posts into nested objects: days > authors > posts
  const grouped = { days: {} };
  posts?.forEach((post) => {
    if (!post) {
      return;
    }

    // Top level is formatted Day strings
    post.updated = new Date(post.updated);
    const formatted = formatDate(post.updated);
    if (!grouped.days[formatted]) {
      grouped.days[formatted] = {};
    }

    // Days contain Author strings
    const day = grouped.days[formatted];
    if (!day[post.feed.author]) {
      day[post.feed.author] = {};
    }

    // Authors contain guid strings, which are references to post Objects
    const author = day[post.feed.author];
    if (!author[post.guid]) {
      author[post.guid] = post;
    }
  });

  return grouped;
};

const sort = (feeds) => {
  return feeds?.sort((a, b) => {
    if (a.author < b.author) return -1;
    if (a.author > b.author) return 1;
    return 0;
  });
};

const fetchData = async (dataUrl) => {
  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return Promise.all(data.map((item) => fetch(`${dataUrl}/${item.id}`).then((r) => r.json())));
  } catch (e) {
    logger.error(e);
  }
  return;
};

router.get('/', async (req, res, next) => {
  try {
    const [feeds, posts] = await Promise.all([fetchData(FEEDS_URL), fetchData(POSTS_URL)]);

    const grouped = getPostDataGrouped(posts);
    res.render('planet', { feeds: sort(feeds), ...grouped });
  } catch (error) {
    logger.error({ error }, 'Error processing posts from Redis');
    next(error);
  }
});

module.exports = router;
