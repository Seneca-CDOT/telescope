const { Router, createError } = require('@senecacdot/satellite');
const { validateQuery } = require('../bin/validation');
const { search, advancedSearch } = require('../search');

const router = Router();

router.get('/', validateQuery, async (req, res, next) => {
  try {
    const { text, filter, page, perPage } = req.query;
    res.send(await search(text, filter, page, perPage));
  } catch (error) {
    next(createError(503, error));
  }
});

// route for advanced
router.get('/advanced', validateQuery, async (req, res, next) => {
  try {
    res.send(await advancedSearch(req.query));
  } catch (error) {
    next(createError(503, error));
  }
});

module.exports = router;
