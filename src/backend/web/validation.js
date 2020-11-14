const Ajv = require('ajv');
const { param, validationResult } = require('express-validator');

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
const validatePostsIdParamRules = [
  param('id', 'Id Length is invalid').isLength({ min: 10, max: 10 }),
];

const validatePostsIdParam = () => {
  return async (req, res, next) => {
    await Promise.all(validatePostsIdParamRules.map((rule) => rule.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    const errors = result.array();
    return res.status(400).send(errors);
  };
};

module.exports = {
  validateNewFeed,
  validatePostsIdParam,
};
