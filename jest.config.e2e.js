const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/src/api/**/jest.config.e2e.js'],
};
