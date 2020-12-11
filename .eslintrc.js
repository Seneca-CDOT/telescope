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
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['prettier', 'promise', 'react', 'react-hooks'],
  settings: {
    react: {
      version: '16.13',
    },
  },
  overrides: [
    // TypeScript for Next.js
    {
      files: ['src/frontend/next/**/*.ts', 'src/frontend/next/**/*.tsx'],
      plugins: ['@typescript-eslint'],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'jsx-a11y/anchor-is-valid': [
          'error',
          {
            components: ['Link'],
            specialLink: ['hrefLeft', 'hrefRight'],
            aspects: ['invalidHref', 'preferButton'],
          },
        ],
        'import/extensions': 'off',
      },
    },

    // JavaScript for Gatsby
    {
      files: ['src/frontend/gatsby/**/*.js', 'src/frontend/gatsby/**/*.jsx'],
      env: { node: true, browser: true, jest: true },
      rules: {
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
        'react/jsx-uses-react': 'error',
        'react/forbid-prop-types': 'off',
        'react/require-default-props': 'off',
        'import/extensions': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },

    // JavaScript for Node.js
    {
      files: ['src/backend/**/*.js', 'src/tools/**/*.js'],
      env: {
        node: true,
      },
    },

    // Jest Test files
    {
      files: ['test/**/*.js', '*.test.js', '*.test.ts', '**/__mocks__/**/*.js'],
      env: { jest: true, node: true },
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
     * The following are eslint rules from the promise-plugin
     * https://github.com/xjamundx/eslint-plugin-promise
     */
    /**
     * Prefer wait to then() for reading Promise values
     */
    'promise/prefer-await-to-then': 'warn',

    /**
     * Prefer async/await to the callback pattern
     */
    'promise/prefer-await-to-callbacks': 'warn',

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
  },
};
