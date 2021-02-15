const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  preset: 'ts-jest',
  rootDir: '../..',
  testMatch: ['<rootDir>/src/web/src/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/web/.next', '<rootDir>/src/web/out'],
  collectCoverageFrom: ['src/**/*{ts,tsx}'],
};
