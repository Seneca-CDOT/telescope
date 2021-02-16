const { Router } = require('@senecacdot/satellite');
const { checkValidUrl, checkValidBlogPage, discoverFeedUrls } = require('./lib');

const router = Router();

router.post('/', [checkValidUrl, checkValidBlogPage, discoverFeedUrls], (req, res) => {
  res.status(200).json({
    feedUrls: res.locals.feedUrls,
  });
});

module.exports = router;
