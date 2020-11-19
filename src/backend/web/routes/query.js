const express = require('express');

const { validateQuery } = require('../validation');
const { logger } = require('../../utils/logger');
const { search } = require('../../utils/indexer');

const router = express.Router();

router.get('/', validateQuery(), async (req, res) => {
  try {
    const { text, filter, page, perPage } = req.query;
    res.send(await search(text, filter, page, perPage));
  } catch (error) {
    res.send(`There was an error while executing your query: ${error}`);
    logger.error({ error }, 'Something went wrong with search indexing');
  }
});

module.exports = router;
