const express = require('express');
const passport = require('passport');

const { logger } = require('../../utils/logger');

const router = express.Router();
const telescopeHomeUrl = '/';

/**
 * /auth/login/callback is where the external SAML SSO provider will redirect
 * users upon successful login.  We redirect the user back to wherever
 * they were trying to go, or to the home page
 */
router.post('/login/callback', passport.authenticate('saml'), (req, res) => {
  let returnTo;
  if (req.session) {
    returnTo = req.session.returnTo;
    delete req.session.returnTo;
  }

  res.redirect(returnTo || telescopeHomeUrl);
});

/**
 * /auth/login will allow users to authenticate with the external
 * SAML SSO provider
 */
router.get('/login', passport.authenticate('saml'));

/**
 * /auth/logout/callback is where the external SAML SSO provider will redirect
 * users upon successful logout.  We support both GET and POST, since different
 * IdPs do it different ways.
 */
function logoutCallback(req, res) {
  // Clear session passport.js user info
  req.logout();
  res.redirect(telescopeHomeUrl);
}
router.get('/logout/callback', logoutCallback);
router.post('/logout/callback', logoutCallback);

/**
 * /auth/logout allows users to use Single Logout and clear login tokens
 * from their passport.js session.
 */
router.get('/logout', (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    passport._strategy('saml').logout(req, (error, requestUrl) => {
      if (error) {
        logger.error({ error }, 'logout error - unable to generate logout URL');
        // Logout on the SP, since we can't do a full IdP logout for some reason.
        logoutCallback(req, res);
      } else {
        res.redirect(requestUrl);
      }
    });
  } catch (error) {
    logger.error({ error }, 'logout error');
    res.redirect(telescopeHomeUrl);
  }
});

module.exports = router;
