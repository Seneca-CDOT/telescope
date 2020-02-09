/* eslint-disable no-underscore-dangle */

/**
 * A mock auth module to help with development.  Not to be used in production!
 */
const express = require('express');
const passport = require('passport');

const MockSamlStrategy = require('../../authentication/mock-saml-strategy');

const router = express.Router();

/**
 * /auth/login mimics logging in successfully
 */
router.get('/login', (req, res) => {
  MockSamlStrategy.login();
  res.redirect('/');
});

/**
 * Expose a logout method, to provide idP-initiated SLO
 * https://github.com/bergie/passport-saml/issues/221#issuecomment-338896096
 */
function logout(req, res) {
  MockSamlStrategy.logout();
  req.session = null;
  res.redirect('/');
}

/**
 * /auth/logout mimics logging out
 */
router.get('/logout', passport.authenticate('saml'), logout);

module.exports = router;
