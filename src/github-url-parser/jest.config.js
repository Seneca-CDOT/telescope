const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../..',
  testMatch: ['<rootDir>/src/github-url-parser/test/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/github-url-parser/dist/**/*.js'],
};
