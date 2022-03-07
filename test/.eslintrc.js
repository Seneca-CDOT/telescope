module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['./**/*.js', '*.test.js', '*.test.ts', '*.test.tsx', '**/__mocks__/**/*.js'],
      env: { jest: true, node: true },
    },
  ],
};
