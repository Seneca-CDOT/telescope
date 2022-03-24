const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  setupFiles: ['<rootDir>/src/api/parser/jest.setup.js'],
  testMatch: ['<rootDir>/src/api/parser/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/parser/src/**/*.js'],
};
