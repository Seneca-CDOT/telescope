const express = require('express');
const passport = require('passport');

const router = express.Router();
const telescopeHomeUrl = '/';

/**
 * /auth/login will allow users to authenticate with the external
 * SAML SSO provider
 */
router.get('/login', passport.authenticate('saml'));

/**
 * /auth/callback is where the external SAML SSO provider will redirect
 * users upon successful login.  We redirect the user back to wherever
 * they were trying to go, or to the home page
 */
router.post('/callback', passport.authenticate('saml'), (req, res) => {
  let returnTo;
  if (req.session) {
    returnTo = req.session.returnTo;
    delete req.session.returnTo;
  }

  res.redirect(returnTo || telescopeHomeUrl);
});

/**
 * /auth/logout allows users to clear login tokens from their session
 */
router.get('/logout', (req, res) => {
  // TODO: this isn't removing the auth cookies yet (e.g., SimpleSAMLAuthTokenIdp)
  req.logout();
  res.redirect(telescopeHomeUrl);
});

/**
 * /auth/user allows for the browser to get information about the logged in user.
 * If not logged in, this will return a 401.
 */
router.get('/user', passport.authenticate('saml'), (req, res) => {
  res.json(req.user);
});

module.exports = router;
