module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    '@senecacdot/eslint-config-telescope',
    'plugin:node/recommended',
    'plugin:import/recommended',
  ],
  plugins: ['react'],
  rules: {
    // https://github.com/facebook/docusaurus/blob/main/.eslintrc.js#L122
    // Ignore certain webpack aliases because they can't be resolved
    'import/no-unresolved': [
      'off',
      {
        ignore: ['^@theme', '^@docusaurus', '^@generated', '^@site'],
      },
    ],
    'global-require': 'off',
    'no-use-before-define': 'off',
    'node/no-missing-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    // https://github.com/facebook/docusaurus/blob/main/.eslintrc.js#L154
    // We build a static site, and nearly all components don't change.
    'react/prop-types': 'off',
  },
};
