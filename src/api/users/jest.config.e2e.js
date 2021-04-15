const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/users/test/e2e/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/users/src/**/*.js'],
};
