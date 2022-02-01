const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  setupFiles: ['<rootDir>/src/api/search/jest.setup.js'],
  testMatch: ['<rootDir>/src/api/search/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src.api/search/src/**/*.js'],
};
