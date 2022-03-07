module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['./**/*.js', './**/*.jsx'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      plugins: ['react-native'],
      rules: {
        'no-use-before-define': 'off',
      },
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
