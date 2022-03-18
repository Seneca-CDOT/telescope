module.exports = {
  extends: ['@senecacdot/eslint-config-telescope'],
  rules: {
    'import/extensions': ['error', 'always'],
  },
  env: {
    browser: true,
    node: true,
  },
};
