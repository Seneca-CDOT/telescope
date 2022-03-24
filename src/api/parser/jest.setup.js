const fetch = require('jest-fetch-mock');

// Mock fetch for the Parser tests
jest.setMock('node-fetch', fetch);

process.env = {
  ...process.env,
  MOCK_REDIS: '1',
  MOCK_ELASTIC: '1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  FEED_URL_INTERVAL_MS: '200',
};
