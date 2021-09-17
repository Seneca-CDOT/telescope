require('dotenv').config();

const { Satellite, logger } = require('@senecacdot/satellite');

const { buildStatusHandler, buildLogHandler } = require('./builds');
const credentials = require('./credentials');
const { webhookHandler } = require('./webhook');

const service = new Satellite({
  credentials: credentials(),
});
const { router } = service;

router.use('/', webhookHandler);
router.get('/status', buildStatusHandler);
router.get('/log', buildLogHandler);

const port = parseInt(process.env.DEPLOY_PORT, 10) || 4000;
service.start(port, () => {
  logger.info(`Server listening on port ${port}`);
});
