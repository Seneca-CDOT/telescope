const { Router, logger } = require('@senecacdot/satellite');
const passport = require('passport');
const { errors } = require('celebrate');
const createError = require('http-errors');

const { createToken } = require('./token');
const { samlMetadata } = require('./authentication');
const {
  validateRedirectAndStateParams,
  validateRedirectUriOrigin,
  captureAuthDetailsOnSession,
} = require('./middleware');

const router = Router();

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

  // Create a token for this user, setting their authorization roles
  const { user } = req;
  const token = createToken(
    user.email,
    user.firstName,
    user.lastName,
    user.displayName,
    user.roles,
    user.avatarUrl
  );

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
 * Provide SAML Metadata endpoint for our Service Provider's Entity ID.
 * The naming is {host}/sp, for example: http://localhost/v1/auth/sp
 */
router.get('/sp', (req, res) => {
  res.type('application/xml');
  res.status(200).send(samlMetadata());
});

// Let Celebrate handle validation errors
router.use(errors());

module.exports = router;
