const path = require('path');

// Pull in the default development environment for all tests.  Override as necessary
require('dotenv').config({ path: path.join(__dirname, './config/env.development') });

// Quiet the logs during tests
process.env.LOG_LEVEL = 'silent';
console.log('LOG_LEVEL set to `silent`, change in jest.config.base.js if you want more logs');

// A base config for all our Jest test projects to use
module.exports = {
  verbose: true,
  coverageDirectory: '<rootDir>/coverage',
  moduleDirectories: ['node_modules'],
  automock: false,
  testTimeout: 20000,
};
