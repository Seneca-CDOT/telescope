'use strict';

module.exports = {
  extends: ['stylelint-config-prettier', 'stylelint-prettier/recommended'],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
  },
};
