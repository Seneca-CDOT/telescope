const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/dependency-discovery/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/dependency-discovery/src/**/*.js'],
};
