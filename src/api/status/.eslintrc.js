module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['./src/**/*.js'],
      rules: {
        'import/extensions': ['error', 'always'],
      },
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
