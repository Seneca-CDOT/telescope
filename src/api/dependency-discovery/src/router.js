const { Router } = require('@senecacdot/satellite');
const dependencyList = require('./dependency-list');

const router = Router();

router.get('/projects', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'max-age=3600');
    res.status(200).json(await dependencyList);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
