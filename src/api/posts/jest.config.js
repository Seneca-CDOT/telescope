const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  setupFiles: ['<rootDir>/src/api/posts/jest.setup.js'],
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/posts/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src.api/posts/src/**/*.js'],
};
