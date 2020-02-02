const express = require('express');
const passport = require('passport');

const { logger } = require('../../utils/logger');

const router = express.Router();

/**
 * Redirect the user to the home page of the app.
 * @param {Response} res the express response object
 */
function goHome(res) {
  res.redirect('/');
}

/**
 * /auth/login will allow users to authenticate with the external
 * SAML SSO provider
 */
router.get('/login', passport.authenticate('saml'));

/**
 * /auth/callback is where the external SAML SSO provider will redirect
 * users upon successful login.  We redirect the user back to  */
router.post('/callback', passport.authenticate('saml'), (req, res) => {
  logger.info({ user: req.user }, 'SSO login callback');
  goHome(res);
});

/**
 * /auth/logout allows users to clear login tokens from their session
 */
router.get('/logout', (req, res) => {
  req.logout();
  goHome(res);
});

module.exports = router;
