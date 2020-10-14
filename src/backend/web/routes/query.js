const express = require('express');

const { logger } = require('../../utils/logger');
const { search } = require('../../utils/indexer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const maxSearchLength = 256;

    if (!req.query.search) {
      const error = 'Validation failed, query parameter search length is empty or undefined';
      res.status(400);
      throw error;
    }

    // Github rule, query is greater than 256 chars return a validation failed message
    if (req.query.search.length > maxSearchLength) {
      const error =
        'Validation failed, query parameter search length is greater than 256 characters.';
      res.status(400);
      throw error;
    }

    res.send(await search(req.query.search));
  } catch (error) {
    res.send(`There was an error while executing your query: ${error}`);
    logger.error({ error }, 'Something went wrong with search indexing');
  }
});

module.exports = router;
