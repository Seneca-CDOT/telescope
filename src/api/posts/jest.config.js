const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/posts/tests/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src.api/posts/src/**/*.js'],
};
