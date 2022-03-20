module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['./src/**/*.js'],
      env: {
        browser: true,
        node: true,
      },
      rules: {
        'import/extensions': ['error', 'always'],
        'no-unused-vars': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
    },
  ],
};
