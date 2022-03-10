module.exports = {
  extends: '@senecacdot/eslint-config-telescope',
  overrides: [
    {
      files: ['./**/*.js', './**/*.jsx'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      plugins: ['react-native'],
      rules: {
        'no-use-before-define': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
        'react/no-unescaped-entities': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
