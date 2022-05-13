module.exports = {
  extends: ['@senecacdot/eslint-config-telescope', 'plugin:react-native/all'],
  plugins: ['react-native'],
  rules: {
    'no-use-before-define': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-native/no-color-literals': 'off',
    /**
     * False positive of no-shadow rule with ENUMs
     * https://github.com/typescript-eslint/typescript-eslint/issues/2483
     */
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    /**
     * Disabled due to bug see:
     * https://github.com/Intellicode/eslint-plugin-react-native/issues/270
     */
    'react-native/no-raw-text': 'off',
  },
  env: {
    'react-native/react-native': true,
  },
};
