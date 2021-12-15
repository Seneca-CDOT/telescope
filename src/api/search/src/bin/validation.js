const { oneOf, check, validationResult } = require('express-validator');

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

/**
 * Advanced search is more flexible, only needs at least ONE field, but can run without any too.
 * Date formats must be YYYY-MM-DD
 */
const advancedQueryValidationRules = [
  oneOf([
    check('post')
      .exists({ checkFalsy: true })
      .withMessage('post should not be empty')
      .bail()
      .isLength({ max: 256, min: 1 })
      .withMessage('post should be between 1 to 256 characters')
      .bail(),
    check('author')
      .exists({ checkFalsy: true })
      .withMessage('author should exist')
      .bail()
      .isLength({ max: 100, min: 2 })
      .withMessage('invalid author value')
      .bail(),
    check('title')
      .exists({ checkFalsy: true })
      .withMessage('title should exist')
      .bail()
      .isLength({ max: 100, min: 2 })
      .withMessage('invalid title value')
      .bail(),
  ]),
  check('to').optional().isISO8601().withMessage('invalid date format').bail(),

  check('from').optional().isISO8601().withMessage('invalid date format').bail(),
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

/**
 * Validates query by passing rules. The rules are different based on the pathname
 * of the request. If the pathname is '/' it is the basic route.
 * Otherwise, if '/advanced/' it is the advanced search
 */
const validateQuery = () => {
  return async (req, res, next) => {
    const rules = req.baseUrl === '/' ? queryValidationRules : advancedQueryValidationRules;

    await Promise.all(rules.map((rule) => rule.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return res.status(400).send(errors);
  };
};

module.exports.validateQuery = validateQuery();
