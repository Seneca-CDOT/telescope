const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  projects: [
    // Our front-end
    '<rootDir>/src/web/app/jest.config.js',
    // Satellite
    '<rootDir>/src/satellite/jest.config.js',
    // Our current microservices, we're missing a few that needs tests still
    '<rootDir>/src/api/dependency-discovery/jest.config.js',
    '<rootDir>/src/api/feed-discovery/jest.config.js',
    '<rootDir>/src/api/image/jest.config.js',
    '<rootDir>/src/api/posts/jest.config.js',
    '<rootDir>/src/api/search/jest.config.js',
    '<rootDir>/src/api/sso/jest.config.js',
    '<rootDir>/src/api/parser/jest.config.js',
  ],
};
