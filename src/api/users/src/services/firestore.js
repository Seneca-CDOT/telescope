/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */

const admin = require('firebase-admin');
const { logger } = require('@senecacdot/satellite');

try {
  // Docker is responsible for putting this file in the root of the container
  admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')),
  });

  logger.debug('Server running in online mode');
} catch (err) {
  if (process.env.NODE_ENV === 'production') {
    logger.error({ err }, 'Unable to load Firebase config');
    process.exit(1);
  }

  // In development, fall-back to use the emulator
  admin.initializeApp({
    projectId: 'telescope',
    credential: admin.credential.applicationDefault(),
  });

  logger.debug('Server running in emulator mode');
}

module.exports = admin.firestore();
