module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['src/backend/**/*.js'],
      env: {
        node: true,
      },
    },
  ],
};
