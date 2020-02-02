const express = require('express');

const { logger } = require('../../utils/logger');

const { authenticateUser } = require('../authentication');

const router = express.Router();

// Only authenticated users can use this route
router.use('/info', authenticateUser(false), (req, res) => {
  if (!req.user) {
    logger.error('missing req.user!');
    res.status(503).json({
      message: `Missing user info`,
    });
  } else {
    res.json(req.user);
  }
});

// Any user can use this route as a way to check if the user is authenticated already.
router.use('/authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
