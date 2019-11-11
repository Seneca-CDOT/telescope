module.exports = {
  "extends": "airbnb-base",
  "env": {
    "jest": true,
    "browser": true,
    "jquery": true
  },

  rules: {
    /**
     * Disallow the use of console
     * https://eslint.org/docs/rules/no-console
     */
    "no-console": "off",


    /**
     * Disallow Reassignment of Function Parameters
     * https://eslint.org/docs/rules/no-param-reassign
     */
    "no-param-reassign": ["error", { props: false }],

    /**
     * Require or disallow named function expressions
     * https://eslint.org/docs/rules/func-names
     */
    "func-names": "off",

    "max-len": ["error", 256, 2, {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: false,
            ignoreTemplateLiterals: false,
          }],
    'no-plusplus': 'off'
  }
};
