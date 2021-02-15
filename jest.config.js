const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  projects: [
    // Our legacy backend tests, slowly being migrated to microservices
    '<rootDir>/test/jest.config.js',
    // Our new microservices
    '<rootDir>/src/api/**/jest.config.js',
    // Our front-end
    '<rootDir>/src/web/jest.config.js',
  ],
};
