// eslint-disable-next-line
const { waitForPostgres } = require('@jcoreio/wait-for-postgres');
// eslint-disable-next-line import/no-extraneous-dependencies
const waitOn = require('wait-on');

const baseConfig = require('../../../jest.config.base');

const waitOnSupabase = async () => {
  try {
    console.log('Waiting for Supabase postgres container to become ready...');
    await waitForPostgres({
      host: 'localhost',
      user: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      timeout: 60 * 1000,
    });
    console.log('Supabase postgres container ready.');
  } catch (err) {
    console.warn('Unable to connect to postgres container');
    throw err;
  }
};

const waitOnTestWebContent = async () => {
  try {
    console.log('Waiting for test-web-content container to become ready...');
    await waitOn({ resources: ['http://localhost:8888/auth.html'] });
    console.log('test-web-content container ready.');
  } catch (err) {
    console.warn('Unable to connect to test-web-content container');
    throw err;
  }
};

module.exports = async () => {
  await Promise.all([waitOnSupabase(), waitOnTestWebContent()]);

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
