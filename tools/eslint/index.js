module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2021 },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:jest-playwright/recommended',
  ],
  plugins: ['prettier', 'promise', 'jest', 'anti-trojan-source', 'react', 'react-hooks'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: '17.0',
    },
  },
  env: {
    es2021: true,
  },

  // Default rules for any file we lint
  rules: {
    /**
     * Force prettier formatting
     */

    'prettier/prettier': 'error',
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

    /** Disallows unnecessary return await
     * https://eslint.org/docs/rules/no-return-await
     */
    'no-return-await': 'error',
    /**
     * Disallow using an async function as a Promise executor
     * https://eslint.org/docs/rules/no-async-promise-executor
     */
    'no-async-promise-executor': 'error',
    /**
     * Disallow await inside of loops
     * https://eslint.org/docs/rules/no-await-in-loop
     */
    'no-await-in-loop': 'error',

    /**
     * Disallow assignments that can lead to race conditions due to
     * usage of await or yield
     * https://eslint.org/docs/rules/require-atomic-updates
     */
    'require-atomic-updates': 'error',

    /**
     * Disallow async functions which have no await expression
     * https://eslint.org/docs/rules/require-await
     */
    'require-await': 'error',

    /**
     * Require or disallow named function expressions
     * https://eslint.org/docs/rules/func-names
     */
    'func-names': 'off',
    /**
     * Disallow enforcement of consistent linebreak style
     * https://eslint.org/docs/rules/func-names
     */
    'linebreak-style': 'off',

    /**
     * Prevent variables used in JSX to be incorrectly marked as unused
     */
    'react/jsx-uses-vars': 'error',

    /**
     * Allow ES6 classes to override methods without using this
     * https://eslint.org/docs/rules/class-methods-use-this
     */
    'class-methods-use-this': 'off',

    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-danger': 'off',

    'jsx-a11y/control-has-associated-label': 'warn',

    /**
     * Halt if a trojan source attack is found
     * https://github.com/lirantal/eslint-plugin-anti-trojan-source
     */
    'anti-trojan-source/no-bidi': 'error',

    'no-bitwise': ['error', { int32Hint: true }],
  },
};
