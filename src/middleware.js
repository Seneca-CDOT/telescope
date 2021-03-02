const jwt = require("express-jwt");
const createError = require("http-errors");
const logger = require("./logger");

// JWT Validation Middleware. A user must have a valid bearer token.
// We expect to get JWT config details via the env.
function isAuthenticated() {
  return jwt({
    secret: process.env.SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    // TODO: proper public/private key token signing
    algorithms: ["HS256"],
  });
}

// Check to see if an already Authenticated user is Authorized to do something,
// based on their role. For example, if a user must have the 'admin' role.
// NOTE: isAuthorized() assumes (and depends upon) isAuthenticated() being
// called first.
function isAuthorized(options) {
  // We expect to get an array (roles) of strings with 1 or more values
  const { roles } = options;
  if (
    !(
      Array.isArray(roles) &&
      roles.length &&
      roles.every((role) => typeof role === "string")
    )
  ) {
    throw new Error("missing roles option");
  }

  return function (req, res, next) {
    if (!(req.user && req.user.roles)) {
      next(createError(401, `no user or role info`));
      return;
    }

    // Check that all of the expected roles are present in this user's roles
    for (const role of roles) {
      if (!req.user.roles.includes(role)) {
        next(createError(403, `user missing required role: ${role}`));
        return;
      }
    }

    // Authorized, let this proceed.
    next();
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

  if (req.accepts("html")) {
    res.set("Content-Type", "text/html");
    res.send(`<h1>${err.status} Error</h1><p>${err.message}</p>`);
  } else if (req.accepts("json")) {
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
