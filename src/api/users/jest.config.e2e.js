const baseConfig = require('../../../jest.config.base');

// override to pass e2e tests
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8088';

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/users/test/e2e/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/users/src/**/*.js'],
};
