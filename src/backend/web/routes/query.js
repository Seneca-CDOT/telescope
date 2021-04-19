const express = require('express');

const { validateQuery } = require('../validation');
const { logger } = require('../../utils/logger');
const { search } = require('../../utils/indexer');

const router = express.Router();

router.get('/', validateQuery(), async (req, res, next) => {
  try {
    const { text, filter, page, perPage } = req.query;
    res.send(await search(text, filter, page, perPage));
  } catch (error) {
    logger.error({ error }, 'Something went wrong with search indexing');
    next(error);
  }
});

module.exports = router;
