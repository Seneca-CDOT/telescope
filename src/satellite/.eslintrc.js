module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./src/**/*.js', './test.js'],
      env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
      },
      rules: {
        'no-unused-vars': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
    },
  ],
};
