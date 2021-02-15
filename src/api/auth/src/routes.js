const { Router, logger } = require('@senecacdot/satellite');
const passport = require('passport');
const { celebrate, Segments, Joi, errors } = require('celebrate');
const createError = require('http-errors');

const { createToken } = require('./token');
const { samlMetadata } = require('./authentication');

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

const router = Router();

// Middleware to validate the presence and format of the redirect_uri and
// state values on the query string. The redirect_uri must be a valid
// http:// or https:// URI, and state is optional. NOTE: we validate the
// origin of the redirect_uri itself in another middleware.
function validateRedirectAndStateParams() {
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
}

// Middleware to make sure the redirect_uri we get on the query string
// is for an origin that was previously registered with us (e.g., it's allowed).
// We want to avoid redirecting users to apps we don't know about.
function validateRedirectUriOrigin() {
  return (req, res, next) => {
    const redirectUri = req.query.redirect_uri;
    try {
      const redirectOrigin = new URL(redirectUri).origin;
      if (!allowedOrigins.includes(redirectOrigin)) {
        logger.warn(
          `Invalid redirect_uri passed to /login: ${redirectUri}, [${allowedOrigins.join(', ')}]`
        );
        next(createError(401, `redirect_uri not allowed`));
      } else {
        // Origin is allowed, let this request continue
        next();
      }
    } catch (err) {
      next(err);
    }
  };
}

// Middleware to capture authorization details passed on the query string
// to the session.  We use the object name passed to use (login or logout).
function captureAuthDetailsOnSession() {
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
}

/**
 * /login allows users to authenticate with the external SAML SSO provider.
 * The caller needs to provide a request_uri query param to indicate where
 * we should redirect
 */
router.get(
  '/login',
  validateRedirectAndStateParams(),
  validateRedirectUriOrigin(),
  captureAuthDetailsOnSession(),
  passport.authenticate('saml')
);

/**
 * /login/callback is where the external SAML SSO provider will redirect
 * users upon successful login.  We redirect the user back to wherever
 * they were trying to go, along with their original state unmodified.
 */
router.post('/login/callback', passport.authenticate('saml'), (req, res, next) => {
  // We should have a login object in the session. If not, something's wrong.
  if (!req.session.authDetails) {
    logger.warn('/login/callback route hit without valid login session details');
    next(createError(400, `unexpected access of /login/callback`));
    return;
  }

  const { redirectUri, state } = req.session.authDetails;
  delete req.session.authDetails;
  logger.debug({ redirectUri, state }, 'processing /login/callback');

  // TODO - need actual user subject info...
  const token = createToken(req.user.email);

  let url = `${redirectUri}?access_token=${token}`;
  // Add the state we received before, if it was given at all
  if (state) {
    url += `&state=${state}`;
  }

  // TODO: send back expires info too?
  res.redirect(url);
});

/**
 * /logout/callback is where the external SAML SSO provider will redirect
 * users upon successful logout. We support both GET and POST, since different
 * IdPs do it different ways.
 */
function logout() {
  return (req, res, next) => {
    // We should have a logout object in the session. If not, something's wrong.
    if (!req.session.authDetails) {
      logger.warn('/logout/callback route hit without valid logout session details');
      next(createError(400, `unexpected access of /logout/callback`));
      return;
    }

    const { redirectUri, state } = req.session.authDetails;
    delete req.session.authDetails;
    logger.debug({ redirectUri, state }, 'processing /logout/callback');

    // Clear session passport.js user info
    req.logout();

    // Add the state on the redirect if present
    const url = state ? `${redirectUri}?state=${state}` : redirectUri;
    res.redirect(url);
  };
}

router.get('/logout/callback', logout());
router.post('/logout/callback', logout());

/**
 * /logout allows users to use Single Logout and clear login tokens
 * from their passport.js session.
 */
router.get(
  '/logout',
  validateRedirectAndStateParams(),
  validateRedirectUriOrigin(),
  captureAuthDetailsOnSession(),
  // passport.authenticate('saml'),
  (req, res, next) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      passport._strategy('saml').logout(req, (error, requestUrl) => {
        if (error) {
          logger.error({ error }, 'logout error - unable to generate logout URL');
          next(createError(500, `unable to logout`));
        } else {
          res.redirect(requestUrl);
        }
      });
    } catch (error) {
      logger.error({ error }, 'logout error');
      next(createError(500, `unable to logout`));
    }
  }
);

/**
 * Determine whether a user with the attached bearer token in the Authorization
 * header is an authorized user. Services can pass a token to the /authorize
 * endpoint, received from a client app, and determine whether or not the token
 * is valid, verified, and allowed to proceed.
 */
router.get('/authorize', passport.authenticate('jwt', { session: false }), (req, res) => {
  // TODO: send back any info?
  res.status(200).end();
});

/**
 * Provide SAML Metadata endpoint for our Service Provider's Entity ID.
 * The naming is {host}/sp, for example: http://auth.docker.localhost/sp
 */
router.get('/sp', (req, res) => {
  res.type('application/xml');
  res.status(200).send(samlMetadata());
});

// Let Celebrate handle validation errors
router.use(errors());

module.exports = router;
