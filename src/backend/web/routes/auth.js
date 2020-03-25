const express = require('express');
const passport = require('passport');

const { strategy } = require('../authentication');
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
 * Expose a logout method, to provide idP-initiated SLO
 * https://github.com/bergie/passport-saml/issues/221#issuecomment-338896096
 */
function logout(req, res) {
  try {
    // TODO: confirm I can use strategy above... was: const strategy = passport._strategy('saml');
    strategy.logout(req, (error, requestUrl) => {
      if (error) {
        logger.error({ error }, 'logout error - unable to generate logout URL');
        res.redirect(requestUrl);
      }
      req.session = null;
      res.redirect('/');
    });
  } catch (error) {
    logger.error({ error }, 'logout error');
    res.redirect('/');
  }
}

/**
 * /auth/logout/callback is where the external SAML SSO provider will redirect
 * users upon successful logout.
 */
router.post('/logout/callback', (req, res) => {
  req.logout();
  // TODO: Destroy the cookie session, this isn't working yet...
  req.session = null;
  res.redirect('/');
});

/**
 * /auth/logout allows users to clear login tokens from their session
 */
router.get('/logout', passport.authenticate('saml'), logout);

module.exports = router;
