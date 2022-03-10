module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./src/**/*.js'],
      rules: {
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
