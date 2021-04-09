const path = require('path');

// Pull in the default development environment for all tests.  Override as necessary
require('dotenv').config({ path: path.join(__dirname, './config/env.development') });

// A base config for all our Jest test projects to use
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: '<rootDir>/coverage',
  moduleDirectories: ['node_modules'],
  automock: false,
  testTimeout: 30000,
};
