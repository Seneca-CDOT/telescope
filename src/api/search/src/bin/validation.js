const { check, validationResult } = require('express-validator');

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
    .isIn(['post', 'author', 'date'])
    .withMessage('invalid filter value')
    .bail(),

  check('perPage')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('perPage should be empty or a number between 1 to 10')
    .bail(),

  check('page')
    .optional()
    .isInt({ min: 0, max: 999 })
    .withMessage('page should be empty or a number between 0 to 999')
    .bail(),
];

const validateQuery = (rules) => {
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

module.exports.validateQuery = validateQuery(queryValidationRules);
