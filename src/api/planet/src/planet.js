const { Router } = require('@senecacdot/satellite');
const { getFeeds, getPosts } = require('./util');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const [feeds, posts] = await Promise.all([getFeeds(), getPosts()]);
    res.render('planet', { feeds, ...posts });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
