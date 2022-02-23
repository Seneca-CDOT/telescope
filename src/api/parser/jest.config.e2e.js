const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/parser/test/e2e/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/parser/src/*.js'],
  // Try reducing the number of tests that can run at once down to 1
  maxConcurrency: 1,
  maxWorkers: 1,
};
