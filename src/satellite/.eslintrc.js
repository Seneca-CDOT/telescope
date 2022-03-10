module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./**/*.ts', './**/*.tsx'],
      env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
      },
    },
  ],
};
