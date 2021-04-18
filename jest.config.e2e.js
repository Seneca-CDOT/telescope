const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/src/api/**/jest.config.e2e.js'],
  // Some tests depend on auth state, which can get out of sync if we run tests
  // in parallel. Run only one e2e test at a time.
  maxConcurrency: 1,
  maxWorkers: 1,
};
