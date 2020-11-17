const { check, query, param, validationResult } = require('express-validator');

// creates a validation middleware with any given rules
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

// Rules for Validation of feeds for the /post route
const feedValidationRules = [
  // user must be string and not empty
  check('user')
    .exists({ checkFalsy: true })
    .withMessage('username is required')
    .bail()
    .isString()
    .withMessage('username must be string')
    .bail(),
  // author must be string and not empty
  check('author')
    .exists({ checkFalsy: true })
    .withMessage('author is required')
    .bail()
    .isString()
    .withMessage('author must be string')
    .bail(),
  // url must be string, follows url format and must be a valid url
  check('url')
    .isString()
    .withMessage('url must be string')
    .bail()
    .isURL({ protocols: ['http', 'https'], require_valid_protocol: true, require_protocol: true })
    .withMessage('url must be a valid url')
    .bail(),
];

// Rules for Validation of query params for the /posts route
const postsQueryValidationRules = [
  query('per_page', 'per_page needs to be empty or a integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
  query('page', 'page needs to be empty or an integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
];

// query validation starts here
// queryValidation rules

const queryValidationRules = [
  // text must be between 1 and 256 and not empty
  check('text')
    .exists({ checkFalsy: true })
    .withMessage('text should not be empty')
    .bail()
    .isLength({ max: 256, min: 1 })
    .withMessage('text should be between 1 to 256 characters')
    .bail(),
  // filter must exist and have a valid value
  check('filter')
    .exists({ checkFalsy: true })
    .withMessage('filter should exist')
    .bail()
    .isIn(['post', 'author'])
    .withMessage('invalid filter value')
    .bail(),

  query('perPage', 'per_page needs to be empty or a integer').custom(
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
  validateNewFeed: () => validate(feedValidationRules),
  validateQuery: () => validate(queryValidationRules),
  validatePostsQuery: () => validate(postsQueryValidationRules),
  validatePostsIdParam: () => validate(postsIdParamValidationRules),
};
