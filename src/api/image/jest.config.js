const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/image/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/image/src/**/*.js'],
};
