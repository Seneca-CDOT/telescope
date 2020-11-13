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
      return res.status(400).send();
    } else {
      return next();
    }
  };
}

const validateParam = (req, res, next) => {
  param('id').isLength({ min: 10, max: 10 })(req, res, (err) => {
    console.log(err);
    try {
      validationResult(req).throw();
      next();
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'ID Length is invalid' });
    }
  });
};

module.exports = {
  validateNewFeed,
  validateParam,
};
