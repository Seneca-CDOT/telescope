const nextJest = require('next/jest');

const baseConfig = require('../../../jest.config.base');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: '.' });

module.exports = createJestConfig({
  ...baseConfig,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/web/app/src/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/web/app/.next', '<rootDir>/src/web/app/out'],
  collectCoverageFrom: ['<rootDir>/src/**/*{ts,tsx}'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    '^.+\\.(tsx)$': ['<rootDir>/node_modules/babel-jest', { presets: ['next/babel'] }],
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/web/app/tsconfig.jest.json',
    },
  },
});
