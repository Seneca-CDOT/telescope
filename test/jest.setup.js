const fetch = require('jest-fetch-mock');

// Mock fetch for the Telescope 1.0 back-end tests
jest.setMock('node-fetch', fetch);

// Config variables for testing
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  FEED_URL_INTERVAL_MS: '200',
};
