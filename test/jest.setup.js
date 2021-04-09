const fetch = require('jest-fetch-mock');

// Mock fetch for the Telescope 1.0 back-end tests
jest.setMock('node-fetch', fetch);
