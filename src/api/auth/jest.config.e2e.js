const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/auth/test/e2e/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/auth/src/**/*.js'],
  // We use jest-playwright to do browser tests, https://github.com/playwright-community/jest-playwright
  // See the jest-playwright config in the Telescope root ./jest-playwright.config.js
  preset: 'jest-playwright-preset',
  // Try reducing the number of tests that can run at once down to 1
  maxConcurrency: 1,
  maxWorkers: 1,
};
