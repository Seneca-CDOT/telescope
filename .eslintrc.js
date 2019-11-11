module.exports = {
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier'],
    env: {
        node: true,
        es6: true,
        jest: true,
        browser: true
    },
    rules: {
        'prettier/prettier': ['error'],

        /**
         * Disallow Assignment Operators in Conditional Statements
         * https://eslint.org/docs/rules/no-cond-assign
         */
        'no-cond-assign': 'error',

        /**
         * Disallow Unnecessary Semicolons
         * https://eslint.org/docs/rules/no-extra-semi
         */
        'no-extra-semi': 'warn',

        /**
         * Require or disallow named function expressions
         * https://eslint.org/docs/rules/func-names
         */
        'func-names': 'off',

        /**
         * Disallow the use of console
         * https://eslint.org/docs/rules/no-console
         */
        'no-console': 'off'
    }
};
