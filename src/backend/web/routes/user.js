const express = require('express');

const { logger } = require('../../utils/logger');

const { authenticate } = require('../authentication');

const router = express.Router();

// Only authenticated users can use this route
router.use('/info', authenticate, (req, res) => {
  if (!req.user) {
    logger.error('missing req.user!');
    res.status(503).json({
      message: `Missing user info`,
    });
  } else {
    res.json(req.user);
  }
});

module.exports = router;
