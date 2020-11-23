module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
  },
  env: {
    jest: true,
    node: true,
    browser: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:react-hooks/recommended',
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
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      rules: {
        'react/prop-types': 'off', // We will use TypeScript's types for component props instead
        'react/react-in-jsx-scope': 'off', // No need to import React when using Next.js
        'jsx-a11y/anchor-is-valid': 'off', // This rule is not compatible with Next.js's <Link /> components
        '@typescript-eslint/no-unused-vars': 'error', // Why would you want unused vars?
      },
    },
    // JavaScript Node apps, Gatsby
    //    {
    //      files: ['*.js', '*.jsx'],
    //      env: {
    //        node: true,
    //      },
    //    },
    // Test Files
    //    {
    //      files: ['*.test.js', '*.test.ts'],
    //      env: {
    //        node: true,
    //        jest: true,
    //      },
    //    },
  ],
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

    'react/jsx-uses-react': 'error',

    'react/jsx-uses-vars': 'error',

    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],

    /**
     * Allow ES6 classes to override methods without using this
     * https://eslint.org/docs/rules/class-methods-use-this
     */
    'class-methods-use-this': 'off',

    'import/no-extraneous-dependencies': 'off',

    'import/extensions': 'off',

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

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-danger': 'off',
    'react/require-default-props': 'off',
  },
};

/*

  env: {
    jest: true,
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ['react', 'pre''@typescript-eslint'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      */
// files: ['**/*.ts', '**/*.tsx'],
/*
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es2021: true,
      },
      extends: [
        'plugin:react/recommended',
        'airbnb',
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
      ],
      rules: {
        'react/prop-types': 'off', // We will use TypeScript's types for component props instead
        'react/react-in-jsx-scope': 'off', // No need to import React when using Next.js
        'jsx-a11y/anchor-is-valid': 'off', // This rule is not compatible with Next.js's <Link /> components
        '@typescript-eslint/no-unused-vars': 'error', // Why would you want unused vars?
        '@typescript-eslint/explicit-function-return-type': [
          // I suggest this setting for requiring return types on functions only where usefull
          'warn',
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      },
    },
  ],
  rules: {},
};
*/
