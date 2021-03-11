const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/posts/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src.api/posts/src/**/*.js'],
};
