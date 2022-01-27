const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/sso/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/sso/src/**/*.js'],
};
