const { waitForPostgres } = require('@jcoreio/wait-for-postgres');

const baseConfig = require('../../../jest.config.base');

module.exports = async () => {
  try {
    console.log('Waiting for Supabase postgres container to become ready...');
    await waitForPostgres({
      host: 'localhost',
      user: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      timeout: 60 * 1000,
    });
  } catch (err) {
    console.warn('Unable to connect to postgres container');
    throw err;
  }

  console.log('Supabase postgres container ready.');
  return {
    ...baseConfig,
    rootDir: '../../..',
    testMatch: ['<rootDir>/src/api/sso/test/e2e/**/*.test.js'],
    collectCoverageFrom: ['<rootDir>/src/api/sso/src/**/*.js'],
    // We use jest-playwright to do browser tests, https://github.com/playwright-community/jest-playwright
    // See the jest-playwright config in the Telescope root ./jest-playwright.config.js
    preset: 'jest-playwright-preset',
    // Try reducing the number of tests that can run at once down to 1
    maxConcurrency: 1,
    maxWorkers: 1,
  };
};
