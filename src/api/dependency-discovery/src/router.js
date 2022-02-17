const { Router } = require('@senecacdot/satellite');
const getDependencies = require('./dependency-list');

const router = Router();

router.get('/projects', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'max-age=3600');
    res.status(200).json(await getDependencies());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
