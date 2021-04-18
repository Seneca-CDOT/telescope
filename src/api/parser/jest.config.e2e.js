const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/parser/test/e2e/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/parser/src/**/*.js'],
  preset: 'jest-playwright-preset',
};
