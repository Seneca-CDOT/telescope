module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 13,
  },
  plugins: ['anti-trojan-source', 'jest'],
  rules: {
    /**
     * Halt if a trojan source attack is found
     * https://github.com/lirantal/eslint-plugin-anti-trojan-source
     */
    'anti-trojan-source/no-bidi': 'error',
  },
};
