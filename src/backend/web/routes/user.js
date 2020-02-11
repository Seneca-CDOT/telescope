const express = require('express');

const { protect } = require('../authentication');
const { logger } = require('../../utils/logger');

const router = express.Router();

// Only authenticated users can use this route
router.get('/info', protect, (req, res) => {
  if (!req.user) {
    logger.error('missing req.user!');
    return res.status(503).json({
      message: `Missing user info`,
    });
  }
  return res.json(req.user);
});

module.exports = router;
