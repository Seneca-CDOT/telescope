const baseConfig = require('../../jest.config.base');

// Define the env variables our code expects
process.env = Object.assign(process.env, {
  JWT_SECRET: 'your-super-secret-jwt-token-with-at-least-32-characters-long',
  JWT_AUDIENCE: 'http://localhost',
  JWT_ISSUER: 'http://localhost',
  JWT_EXPIRES_IN: '1h',
  MOCK_REDIS: '1',
  MOCK_ELASTIC: '1',
});

module.exports = {
  ...baseConfig,
  rootDir: '../..',
  testMatch: ['<rootDir>/src/satellite/test.js'],
  collectCoverageFrom: ['<rootDir>/src/satellite/src/**/*.js'],
  moduleDirectories: ['<rootDir>/src/satellite/node_modules', 'node_modules'],
};
