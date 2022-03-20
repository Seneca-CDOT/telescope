module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./**/*.js'],
      env: {
        jest: true,
        commonjs: true,
        es2021: true,
        node: true,
      },
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
    },
  ],
};
