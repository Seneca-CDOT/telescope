const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  setupFiles: ['<rootDir>/jest.setup.js', '<rootDir>/src/api/auth/jest.setup.js'],
  testMatch: ['<rootDir>/src/api/auth/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/auth/src/**/*.js'],
};
