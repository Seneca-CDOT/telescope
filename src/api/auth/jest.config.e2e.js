const baseConfig = require('../../../jest.config.base');

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  setupFiles: ['<rootDir>/jest.setup.js', '<rootDir>/src/api/auth/jest.setup.js'],
  testMatch: ['<rootDir>/src/api/auth/test/e2e/**/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/auth/src/**/*.js'],
  // We use jest-playwright to do browser tests, https://github.com/playwright-community/jest-playwright
  // See the jest-playwright config in the Telescope root ./jest-playwright.config.js
  preset: 'jest-playwright-preset',
};
