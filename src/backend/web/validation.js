const Ajv = require('ajv');

const { check, query, validationResult } = require('express-validator');

const ajv = new Ajv({ allErrors: true });

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
const validatePostsQueryRules = [
  query('per_page', 'per_page needs to be empty or a integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
  query('page', 'page needs to be empty or an integer').custom(
    (value) => !value || Number.isInteger(+value)
  ),
];
// create the middle ware for the /posts route with error reporting
const validatePostsQuery = () => {
  return async (req, res, next) => {
    await Promise.all(validatePostsQueryRules.map((rule) => rule.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return res.status(400).send(errors);
  };
};

// query validation starts here
// queryValidation rules

const queryValidationRules = () => {
  return [
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
};

// queryValidationFunction
const validateQuery = () => {
  return async (req, res, next) => {
    await Promise.all(queryValidationRules().map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({
      errors: errors.array(),
    });
  };
};


    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return res.status(400).send(errors);
  };
};
module.exports = { validateNewFeed, validateQuery, validatePostsQuery };
