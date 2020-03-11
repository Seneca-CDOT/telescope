const express = require('express');

const { logger } = require('../../utils/logger');
const { search } = require('../../utils/elastic');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // Github rule, query is greater than 256 chars return a validation failed message
  const maxSearchLength = 256;

  if (!req.query.search) {
    const error = new Error('Required query param missing when using query route');
    logger.error({ error });
    error.status = 400;
    res.status(error);
    return next(error);
  }

  if (req.query.search.length > maxSearchLength) {
    const error = 'Validation failed, query length is greater than 256 characters.';
    res.send(error);
    logger.error(error);
  }

  try {
    res.send(await search(req.query.search));
  } catch (error) {
    res.send('There was an error while executing your query.');
    logger.error({ error }, 'Something went wrong with search indexing');
  }
});

module.exports = router;
