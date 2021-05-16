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

// no user can be created as an admin by default
const validateUserRights = () => (req, res, next) => {
  req.body.isAdmin = false;
  next();
};

const updateUser = (makeAdmin = false) => async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const userRef = db.doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      next(createError(404, `user ${id} not found.`));
    } else {
      // if makeAdmin is true turn the user into an admin, if not use body to update user.
      const user = new User(makeAdmin ? { ...body, isAdmin: true } : body);
      // NOTE: doc().update() doesn't use the converter, we have to make a plain object.
      await db.doc(id).update(user.toJSON());
      res.status(200).json({ msg: `Updated user ${id}` });
    }
  } catch (err) {
    next(err);
  }
};

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
exports.validateUserRights = validateUserRights;
exports.validateEmailHash = validateEmailHash;
exports.validatePagingParams = validatePagingParams;
exports.updateUser = updateUser;
