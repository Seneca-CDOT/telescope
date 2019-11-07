module.exports = {
  "extends": "airbnb-base",
  "env": {
    "jest": true,
  },
  rules: {
    "no-console": "off",
    "no-param-reassign": ["error", { props: false }],
    "func-names": "off",
  }
};
