module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  env: {
    jest: true,
    browser: true,
    jquery: true,
    node: true,
    es2017: true,
  },
  rules: {
    'prettier/prettier': ['error'],

    /**
     * Disallow the use of console
     * https://eslint.org/docs/rules/no-console
     */
    'no-console': 'off',

    /**
     * Disallow Reassignment of Function Parameters
     * https://eslint.org/docs/rules/no-param-reassign
     */
    'no-param-reassign': ['error', { props: false }],

    /**
     * Require or disallow named function expressions
     * https://eslint.org/docs/rules/func-names
     */
    'func-names': 'off',
  },
};
