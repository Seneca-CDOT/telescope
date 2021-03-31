const { createError, hash } = require('@senecacdot/satellite');
const { celebrate, Joi, Segments } = require('celebrate');

const validatePagingParams = () =>
  celebrate({
    [Segments.QUERY]: {
      per_page: Joi.number().integer().min(1).max(100).default(20),
      start_after: Joi.string().hex(),
    },
  });

const validateId = () =>
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().hex().required(),
    },
  });

// Generate a display name if none given
const generateDisplayName = (parent) => `${parent.firstName} ${parent.lastName}`;

const validateUser = () =>
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      displayName: Joi.string().default(generateDisplayName),
      isAdmin: Joi.boolean().default(false),
      isFlagged: Joi.boolean().default(false),
      feeds: Joi.array().items(Joi.string().uri()).required(),
      github: Joi.object({
        username: Joi.string(),
        avatarUrl: Joi.string().uri(),
      }).and('username', 'avatarUrl'),
    }),
  });

// Make sure that the :id param matches the hashed value of the user's email if present
const validateEmailHash = () => (req, res, next) => {
  const { email } = req.body;
  const { id } = req.params;

  // The Satellite hash() function uses the first 10 characters of an sha256 hex string.
  // For example: 6Xoj0UXOW3
  if (id !== hash(email)) {
    next(createError(400, `id param invalid for user's email address.`));
    return;
  }
  next();
};

exports.validateUser = validateUser;
exports.validateId = validateId;
exports.validateEmailHash = validateEmailHash;
exports.validatePagingParams = validatePagingParams;
