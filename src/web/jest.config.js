const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '../..',
  testMatch: ['<rootDir>/src/web/src/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/web/.next', '<rootDir>/src/web/out'],
  collectCoverageFrom: ['src/**/*{ts,tsx}'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    '^.+\\.(tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/web/tsconfig.jest.json',
    },
  },
};
