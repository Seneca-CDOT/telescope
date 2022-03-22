module.exports = {
  extends: ['@senecacdot/eslint-config-telescope'],
  settings: {
    react: {
      version: '17.0',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
  },
  env: {
    browser: true,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/extensions': 'off',
    // Allow using TypeScript constructor shorthand: `Foo(public bar: string){}`
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    /**
     * False positive of no-shadow rule with ENUMs
     * https://github.com/typescript-eslint/typescript-eslint/issues/2483
     */
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
