const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../',
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/backend/**/*.js'],
};
