const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/feed-discovery/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/feed-discovery/src/**/*.js'],
  testEnvironment: 'node',
};
