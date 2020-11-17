const Ajv = require('ajv');

const { check, query, param, validationResult } = require('express-validator');

const ajv = new Ajv({ allErrors: true });

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

// Expect only URI starting with http:// or https://
const validateHttpSchemes = function (schema, uri) {
  return typeof uri === 'string' && uri.search(/https?:\/\//i) === 0;
};

// Expect input fields not empty
const validateNotEmpty = function (schema, data) {
  return typeof data === 'string' && data.trim() !== '';
};

// Not Empty validation
ajv.addKeyword('isNotEmpty', {
  validate: validateNotEmpty,
  errors: false,
});

// Http schemes validation
ajv.addKeyword('httpSchemes', {
  validate: validateHttpSchemes,
  errors: false,
});

const feedSchema = {
  type: 'object',
  properties: {
    user: { type: 'string', isNotEmpty: true },
    url: {
      type: 'string',
      format: 'uri',
      httpSchemes: true,
    },
    author: { type: 'string', isNotEmpty: true },
  },
};

function validateNewFeed() {
  return function (req, res, next) {
    const feedData = req.body;
    const valid = ajv.validate(feedSchema, feedData);

    if (!valid) {
      res.status(400).send();
    } else {
      next();
    }
  };
}
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
];

const postsIdParamValidationRules = [
  param('id', 'Id Length is invalid').isLength({ min: 10, max: 10 }),
];

const feedsIdParamValidationRules = [
  param('id', 'Id Length is invalid').isLength({ min: 10, max: 10 }),
];

module.exports = {
  validateNewFeed,
  validateQuery: () => validate(queryValidationRules),
  validatePostsQuery: () => validate(postsQueryValidationRules),
  validatePostsIdParam: () => validate(postsIdParamValidationRules),
  validateFeedsIdParam: () => validate(feedsIdParamValidationRules),
};
