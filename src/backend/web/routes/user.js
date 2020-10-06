const express = require('express');

const { protect } = require('../authentication');
const { logger } = require('../../utils/logger');

const router = express.Router();

// Only authenticated users can use this route
router.get('/info', protect(), (req, res) => {
  if (!req.user) {
    logger.error('missing req.user!');
    return res.status(503).json({
      message: `Missing user info`,
    });
  }
  return res.json(req.user);
});

router.get('/feeds', protect(), async (req, res) => {
  const { user } = req;
  try {
    const feeds = await user.feeds();
    return res.status(200).send(feeds);
  } catch (error) {
    logger.error('Error with GET feeds');
    return res.status(503).json({ message: "Can't get feeds" });
  }
});

module.exports = router;
