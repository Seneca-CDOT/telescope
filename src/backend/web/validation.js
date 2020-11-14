const Ajv = require('ajv');
const { check, param, validationResult } = require('express-validator');

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
// param validation starts here
// paramValidation rules
const validatePostsIdParamRules = () => {
  return [param('id', 'Id Length is invalid').isLength({ min: 10, max: 10 })];
};

// paramValidationFunction
const validatePostsIdParam = () => {
  return async (req, res, next) => {
    await Promise.all(validatePostsIdParamRules().map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ errors: errors.array() });
  };
};

module.exports = {
  validateNewFeed,
  validateQuery,
  validatePostsIdParam,
};
