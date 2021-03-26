const { Router, logger } = require('@senecacdot/satellite');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('hi');
});

module.exports = router;
