const { celebrate, Joi, Segments } = require('celebrate');

const validateId = () =>
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  });

const validateUser = () =>
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      id: Joi.number().required(),
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
      created: Joi.string(),
      updated: Joi.string(),
    }),
  });

exports.validateUser = validateUser;
exports.validateId = validateId;
