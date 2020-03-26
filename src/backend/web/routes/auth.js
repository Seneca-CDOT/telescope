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
 * users upon successful logout.
 */
router.get('/logout/callback', (req, res) => {
  req.logout();
  res.redirect('/');
});

/**
 * /auth/logout allows users to clear login tokens from their session
 */
router.get('/logout', (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    passport._strategy('saml').logout(req, (error, requestUrl) => {
      if (error) {
        logger.error({ error }, 'logout error - unable to generate logout URL');
        res.redirect('/');
      }
      req.logout();
      res.redirect(requestUrl);
    });
  } catch (error) {
    logger.error({ error }, 'logout error');
    res.redirect('/');
  }
});

module.exports = router;
