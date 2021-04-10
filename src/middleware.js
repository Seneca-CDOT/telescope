const jwt = require('express-jwt');
const createError = require('http-errors');
const logger = require('./logger');

// JWT Validation Middleware. A user must have a valid bearer token.
// We expect to get JWT config details via the env.
function isAuthenticated() {
  return jwt({
    secret: process.env.SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    // TODO: proper public/private key token signing
    algorithms: ['HS256'],
  });
}

// Determine whether the authorization options passed to isAuthorized are valid.
function validateAuthorizationOptions(options = {}) {
  let isValid = false;

  // It's possible that `roles` is defined, an array (roles) of strings with 1 or more values
  const { roles } = options;
  if (Array.isArray(roles) && roles.length && roles.every((role) => typeof role === 'string')) {
    isValid = true;
  }

  // It's possible that an authorizeUser() function is attached
  const { authorizeUser } = options;
  if (typeof authorizeUser === 'function') {
    isValid = true;
  }

  return isValid;
}

// Check to see if an already Authenticated user is Authorized to do something,
// based on the `req` and the `user` payload from the access token. For
// example, if a user must have the 'admin' role, or a user's `sub` claim
// must match an expected id. NOTE: isAuthorized() assumes (and depends upon)
// isAuthenticated() being called first.
function isAuthorized(authorizeUser) {
  if (typeof authorizeUser !== 'function') {
    throw new Error('invalid authorization function');
  }

  return function (req, res, next) {
    const { user } = req;
    if (!user) {
      next(createError(401, `no user or role info`));
      return;
    }

    // If these checks fail for any reason, return a 403
    try {
      if (!authorizeUser(req, user)) {
        next(createError(403, `user not authorized`));
      } else {
        // Authorized, let this proceed.
        next();
      }
    } catch (err) {
      logger.warn({ err }, 'Unexpected error authorizing user');
      next(createError(403, `user not authorized`));
    }
  };
}

// Default error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // Only log 500s
  if (status > 499) {
    logger.error({ err, req, res });
  }

  res.status(status);

  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.send(`<h1>${err.status} Error</h1><p>${err.message}</p>`);
  } else if (req.accepts('json')) {
    res.json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.send(`${err.status} Error: ${err.message}\n`);
  }
}

module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;
module.exports.errorHandler = errorHandler;
