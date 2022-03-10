module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
  },
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:jest-playwright/recommended',
    'plugin:import/recommended',
  ],
  plugins: ['prettier', 'promise', 'jest', 'anti-trojan-source', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {},
    },
    react: {
      version: '17.0',
    },
  },
  overrides: [
    // JavaScript for Node.js
    {
      files: ['src/backend/**/*.js', 'tools/**/*.js', 'src/api/**/*.js'],
      env: {
        node: true,
      },
    },
  ],

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
     * Due to having our dev dependencies in a monorepo layout, this is
     * difficult to configure properly.  Disabling for now.
     */
    'import/no-extraneous-dependencies': ['off'],
    'no-new': 'off',

    /**
     * False positive of no-shadow rule with ENUMs
     * https://github.com/typescript-eslint/typescript-eslint/issues/2483
     */
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    /**
     * Halt if a trojan source attack is found
     * https://github.com/lirantal/eslint-plugin-anti-trojan-source
     */
    'anti-trojan-source/no-bidi': 'error',
  },
};
