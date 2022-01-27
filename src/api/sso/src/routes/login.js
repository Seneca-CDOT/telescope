const { Router, logger, createError } = require('@senecacdot/satellite');
const passport = require('passport');

const { createToken } = require('../token');
const {
  validateRedirectAndStateParams,
  validateRedirectUriOrigin,
  captureAuthDetailsOnSession,
} = require('../middleware');

const router = Router();

/**
 * /login allows users to authenticate with the external SAML SSO provider.
 * The caller needs to provide a request_uri query param to indicate where
 * we should redirect
 */
router.get(
  '/',
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
router.post('/callback', passport.authenticate('saml'), (req, res, next) => {
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

module.exports = router;
