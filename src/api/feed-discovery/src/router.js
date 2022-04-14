const { Router, isAuthenticated } = require('@senecacdot/satellite');
const { checkForArray, checkValidUrls, discoverFeedUrls } = require('./middleware');

const router = Router();

router.post(
  '/',
  // Any authenticated user is fine (i.e., any role/user will work, as long as logged in)
  isAuthenticated(),
  checkForArray(),
  checkValidUrls(),
  discoverFeedUrls(),
  (req, res) => {
    const { feedUrls } = res.locals;

    if (!(feedUrls && feedUrls.length)) {
      return res.status(404).json({ message: 'No feeds discovered' });
    }

    return res.status(200).json({
      feedUrls,
    });
  }
);

module.exports = router;
