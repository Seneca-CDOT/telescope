module.exports = {
  extends: ['@senecacdot/eslint-config-telescope'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      files: 'src/**/*.ts',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/extensions': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
};
