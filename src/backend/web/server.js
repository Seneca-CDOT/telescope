require('../lib/config');
const app = require('./app.js');

const { logger } = app.get('logger');
const HTTP_PORT = process.env.PORT || 3000;

const server = app.listen(HTTP_PORT, () => {
  logger.info(`Telescope listening on port ${HTTP_PORT}`);
});

process.on('unhandledRejection', ({ name, message }) => {
  logger.error('UNHANDLED REJECTION:  Shutting down...');
  logger.error(`${name}: ${message}`);
  server.close(() => {
    process.exit(1);
  });
});
