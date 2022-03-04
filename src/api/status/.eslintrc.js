module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['public/**/*.js'],
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
