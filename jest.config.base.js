// A base config for all our Jest test projects to use
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  coverageDirectory: '<rootDir>/coverage',
  moduleDirectories: ['node_modules'],
  automock: false,
  testTimeout: 30000,
};
