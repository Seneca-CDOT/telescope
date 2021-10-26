const { check, param, validationResult, query } = require('express-validator');

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

const feedValidationRules = [
  check('user')
    .exists({ checkFalsy: true })
    .withMessage('username is required')
    .bail()
    .isString()
    .withMessage('username must be string')
    .bail(),
  check('author')
    .exists({ checkFalsy: true })
    .withMessage('author is required')
    .bail()
    .isString()
    .withMessage('author must be string')
    .bail(),
  check('url')
    .isString()
    .withMessage('url must be string')
    .bail()
    .isURL({ protocols: ['http', 'https'], require_valid_protocol: true, require_protocol: true })
    .withMessage('url must be a valid url')
    .bail(),
];

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

const feedsIdParamValidationRules = [
  param('id', 'Feeds Id Length is invalid').isLength({ min: 10, max: 10 }),
];

module.exports = {
  validateNewFeed: () => validate(feedValidationRules),
  validateFeedsIdParam: () => validate(feedsIdParamValidationRules),
  validatePostsQuery: () => validate(postsQueryValidationRules),
  validatePostsIdParam: () => validate(postsIdParamValidationRules),
};
