const { Router, createError } = require('@senecacdot/satellite');
const { validateQuery } = require('../bin/validation');
const { search } = require('../search');

const router = Router();

router.get('/', validateQuery, async (req, res, next) => {
  try {
    res.send(await search(req.query));
  } catch (error) {
    next(createError(503, error));
  }
});

module.exports = router;
