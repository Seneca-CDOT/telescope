const { celebrate, Joi, Segments } = require('celebrate');

const validatePagingParams = () =>
  celebrate({
    [Segments.QUERY]: {
      per_page: Joi.number().integer().min(1).max(20).default(20),
      page: Joi.number().integer().min(1).default(1),
    },
  });

const validateId = () =>
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  });

const validateUser = () =>
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().integer().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      displayName: Joi.string().default(''),
      isAdmin: Joi.boolean().default(false),
      isFlagged: Joi.boolean().default(false),
      feeds: Joi.array().items(Joi.string()).required(),
      github: Joi.object({
        username: Joi.string(),
        avatarUrl: Joi.string(),
      }).default({ username: '', avatarUrl: '' }),
    }),
  });

exports.validateUser = validateUser;
exports.validateId = validateId;
exports.validatePagingParams = validatePagingParams;
