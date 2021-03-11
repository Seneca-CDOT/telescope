const { param, validationResult, query } = require('express-validator');

const validate = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return res.status(400).send(errors);
  };
};

const postsQueryValidationRules = [
  query('per_page', 'per_page needs to be empty or a integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
  query('page', 'page needs to be empty or an integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
];

const postsIdParamValidationRules = [
  param('id', 'Id Length is invalid').isLength({ min: 10, max: 10 }),
];

module.exports = {
  validatePostsQuery: () => validate(postsQueryValidationRules),
  validatePostsIdParam: () => validate(postsIdParamValidationRules),
};
