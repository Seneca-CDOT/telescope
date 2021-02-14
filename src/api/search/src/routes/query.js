const { Router, logger } = require('@senecacdot/satellite');
const { validateQuery } = require('../bin/validation');
const search = require('../search');

const router = Router();

router.get('/', validateQuery, async (req, res) => {
  try {
    const { text, filter, page, perPage } = req.query;
    res.send(await search(text, filter, page, perPage));
  } catch (error) {
    res.status(500).send(`There was an error while executing your query: ${error}`);
    logger.error({ error }, 'Something went wrong with search indexing');
  }
});

module.exports = router;
