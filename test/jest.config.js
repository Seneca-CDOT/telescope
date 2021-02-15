const baseConfig = require('../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../',
  testMatch: ['<rootDir>/test/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/backend/**/*.js'],
};
