const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/auth/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/auth/src/**/*.js'],
};
