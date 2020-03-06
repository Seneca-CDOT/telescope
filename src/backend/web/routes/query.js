const express = require('express');

const { logger } = require('../../utils/logger');

const router = express.Router();

router.get('/', (req, res) => {
  // Github rule, query is more than 256 chars or contains more than 5 operators
  // return a validation failed message
  if (req.query.q.length > 256 || req.query.q.match(/&& | \|\| | !/g).length > 5) {
    res.send('Validation failed');
    logger.info('Validation failed');
  }
});

module.exports = router;
