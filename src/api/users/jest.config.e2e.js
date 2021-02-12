const path = require('path');
const baseConfig = require('../../../jest.config.base');
require('dotenv').config({
  path: path.join(__dirname, '../../../config/env.development'),
});

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/users/test/e2e/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/users/src/**/*.js'],
};
