const { logger, createError } = require('@senecacdot/satellite');
const { celebrate, Segments, Joi } = require('celebrate');
const fetch = require('node-fetch');

const { matchOrigin, getUserId } = require('./util');

const { USERS_URL } = process.env;

// Space-separated list of App origins that we know about and will allow
// to be used as part of login redirects. You only need to specify
// the origin (scheme://domain:port), for each of these vs. the full URL.
// ALLOWED_APP_DOMAINS="http://app.com http://localhost:3000"
const { ALLOWED_APP_ORIGINS } = process.env;
if (!(ALLOWED_APP_ORIGINS && ALLOWED_APP_ORIGINS.length)) {
  throw new Error('Missing ALLOWED_APP_ORIGINS env variable');
}
let allowedOrigins;
try {
  allowedOrigins = ALLOWED_APP_ORIGINS.trim()
    .split(/ +/)
    .map((uri) => new URL(uri).origin);
} catch (err) {
  throw new Error(`Invalid URI in ALLOWED_APP_ORIGINS: ${err.message}`);
}
logger.info({ allowedOrigins }, 'Accepting Login/Logout for accepted origins');

// Middleware to make sure the redirect_uri we get on the query string
// is for an origin that was previously registered with us (e.g., it's allowed).
// We want to avoid redirecting users to apps we don't know about. We support
// including a wildcard character '*' to allow origins with variable segments,
// for example: https://telescope-pzgueymdv-humphd.vercel.app/ -> https://*-humphd.vercel.app/
module.exports.validateRedirectUriOrigin = function validateRedirectUriOrigin() {
  return (req, res, next) => {
    const redirectUri = req.query.redirect_uri;
    try {
      const redirectOrigin = new URL(redirectUri).origin;
      if (!matchOrigin(redirectOrigin, allowedOrigins)) {
        logger.warn(
          `Invalid redirect_uri passed to /login: ${redirectUri}, [${allowedOrigins.join(', ')}]`
        );
        next(createError(401, `redirect_uri not allowed: ${redirectUri}`));
      } else {
        // Origin is allowed, let this request continue
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};

// Middleware to validate the presence and format of the redirect_uri and
// state values on the query string. The redirect_uri must be a valid
// http:// or https:// URI, and state is optional. NOTE: we validate the
// origin of the redirect_uri itself in another middleware.
module.exports.validateRedirectAndStateParams = function validateRedirectAndStateParams() {
  return celebrate({
    [Segments.QUERY]: Joi.object().keys({
      redirect_uri: Joi.string()
        .uri({
          scheme: [/https?/],
        })
        .required(),
      // state is optional
      state: Joi.string(),
    }),
  });
};

// Middleware to capture authorization details passed on the query string
// to the session.  We use the object name passed to use (login or logout).
module.exports.captureAuthDetailsOnSession = function captureAuthDetailsOnSession() {
  return (req, res, next) => {
    // We'll always have a redirect_uri
    req.session.authDetails = {
      redirectUri: req.query.redirect_uri,
    };

    // Add state if present (optional)
    if (req.query.state) {
      req.session.authDetails.state = req.query.state;
    }

    logger.debug({ authDetails: req.session.authDetails }, 'adding session details');
    next();
  };
};

// Forward a request to create a new user to the Users service.
module.exports.createTelescopeUser = function createTelescopeUser() {
  return async (req, res, next) => {
    try {
      const id = getUserId(req);
      const response = await fetch(`${USERS_URL}/${id}`, {
        method: 'POST',
        headers: {
          // re-use the user's authorization header and token
          Authorization: req.get('Authorization'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (response.status !== 201) {
        logger.warn(
          { status: response.status, id, data: req.body },
          'unable to create user with Users service'
        );
        next(createError(response.status, 'unable to create user'));
        return;
      }

      next();
    } catch (err) {
      logger.error({ err }, 'error creating Telescope user');
      next(createError(500, 'unable to create Telescope user'));
    }
  };
};

// Get user's Telescope profile info from the Users service
module.exports.getTelescopeProfile = function getTelescopeProfile() {
  return async (req, res, next) => {
    try {
      const id = getUserId(req);
      const response = await fetch(`${USERS_URL}/${id}`, {
        headers: {
          // re-use the user's authorization header and token
          Authorization: req.get('Authorization'),
        },
      });

      if (!response.ok) {
        logger.warn({ status: response.status, id }, 'unable to get user info from Users service');
        next(createError(response.status, 'unable to get updated user info'));
        return;
      }

      // Otherwise, it worked. Pass along the user's details
      res.locals.telescopeProfile = await response.json();
      next();
    } catch (err) {
      logger.error({ err }, 'error getting Telescope profile for user');
      next(createError(500, 'unable to get Telescope user profile'));
    }
  };
};
