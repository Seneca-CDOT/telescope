const fs = require('fs');
const path = require('path');
const { logger } = require('@senecacdot/satellite');

// Whether we are running in development vs. production mode.
const isDev = () => process.env.NODE_ENV !== 'production';

// Try to load SSL credentials.
module.exports = function credentials() {
  const { PATH_TO_CERTS } = process.env;
  try {
    return {
      key: fs.readFileSync(path.join(PATH_TO_CERTS, 'privkey.pem')),
      cert: fs.readFileSync(path.join(PATH_TO_CERTS, 'fullchain.pem')),
    };
  } catch (err) {
    logger.warn({ err }, `Unable to load SSL certs from path '${PATH_TO_CERTS}'`);
    // In production, this is fatal. Development can go ahead with HTTP.
    if (!isDev()) {
      process.exit(1);
    } else {
      logger.debug('Falling back to HTTP server');
    }
    return null;
  }
};
