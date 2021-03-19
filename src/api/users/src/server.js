const { logger } = require('@senecacdot/satellite');
const service = require('.');

const PORT = parseInt(process.env.USERS_PORT || 6666, 10);

service.start(PORT, () => {
  logger.debug(`Users microservice started on port ${PORT}`);
});

module.exports = service;
