const express = require('express');

const { logger } = require('../../utils/logger');
const { search } = require('../../utils/indexer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const maxSearchLength = 256;
    const { text, filter } = req.query;

    if (!text || !filter) {
      const error = 'Validation failed, one or both query parameters are undefined';
      res.status(400);
      throw error;
    }

    // Github rule, query is greater than 256 chars return a validation failed message
    if (text.length > maxSearchLength) {
      const error =
        'Validation failed, query parameter search length is greater than 256 characters.';
      res.status(400);
      throw error;
    }

    res.send(await search(text, filter));
  } catch (error) {
    res.send(`There was an error while executing your query: ${error}`);
    logger.error({ error }, 'Something went wrong with search indexing');
  }
});

module.exports = router;
