const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  setupFiles: [
    '<rootDir>/src/api/dependency-discovery/jest.setup.js',
    '<rootDir>/test/jest.setup.js',
  ],
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/dependency-discovery/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src.api/dependency-discovery/src/**/*.js'],
};
