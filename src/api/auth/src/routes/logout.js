const { Router, logger, createError } = require('@senecacdot/satellite');
const passport = require('passport');

const {
  validateRedirectAndStateParams,
  validateRedirectUriOrigin,
  captureAuthDetailsOnSession,
} = require('../middleware');

const router = Router();

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

router.get('/callback', logout());
router.post('/callback', logout());

/**
 * /logout allows users to use Single Logout and clear login tokens
 * from their passport.js session.
 */
router.get(
  '/',
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

module.exports = router;
