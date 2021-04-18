const { Router, isAuthenticated } = require('@senecacdot/satellite');
const { checkValidUrl, checkValidBlog, discoverFeedUrls } = require('./middleware');

const router = Router();

router.post(
  '/',
  // Any authenticated user is fine (i.e., any role/user will work, as long as logged in)
  isAuthenticated(),
  checkValidUrl(),
  checkValidBlog(),
  discoverFeedUrls(),
  (req, res) => {
    res.status(200).json({
      feedUrls: res.locals.feedUrls,
    });
  }
);

module.exports = router;
