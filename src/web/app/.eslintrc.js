module.exports = {
  extends: '@senecacdot/eslint-config-telescope',

  overrides: [
    // TypeScript for Next.js
    {
      files: ['./**/*.ts', './**/*.tsx'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      env: {
        browser: true,
      },
      rules: {
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
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
        // Allow using TypeScript constructor shorthand: `Foo(public bar: string){}`
        'no-useless-constructor': 'off',
        'no-empty-function': 'off',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
