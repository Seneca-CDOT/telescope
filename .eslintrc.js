module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    {
      files: ['./src/backend/**/*.js', './test/**/*.js'],
      env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
      },
      rules: {
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
        'react/no-array-index-key': 'off',
        'react/prop-types': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx'],
          },
        },
      },
    },
  ],
};
