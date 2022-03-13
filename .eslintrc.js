module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./src/backend/**/*.js', './test/**/*.js'],
      rules: {
        'jest/no-standalone-expect': 'off',
        'no-unused-vars': 'error',
      },
      env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
      },
    },
  ],
};
