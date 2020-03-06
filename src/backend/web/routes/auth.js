const express = require('express');

const { samlMetadata, strategy } = require('../authentication');
const { authenticate } = require('../authentication/middleware');
const { logger } = require('../../utils/logger');

const router = express.Router();
const telescopeHomeUrl = '/';

/**
 * /auth/login/callback is where the external SAML SSO provider will redirect
 * users upon successful login.  We redirect the user back to wherever
 * they were trying to go, or to the home page.
 */
router.post('/login/callback', (req, res) => {
  // If there's referrer information on the body, use that for our redirect.
  const referrer = req.body.RelayState;
  res.redirect(referrer || telescopeHomeUrl);
});

/**
 * /auth/login will allow users to authenticate with the external
 * SAML SSO provider. We add an extra middleware to grab the originating URL.
 */
router.get('/login', authenticate());

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
    });
  } catch (error) {
    logger.error({ error }, 'logout error');
    res.redirect(telescopeHomeUrl);
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

  // If there's referrer information on the body, use that for our redirect.
  const referrer = req.body.RelayState;
  res.redirect(referrer || telescopeHomeUrl);
});

/**
 * /auth/logout allows users to clear login tokens from their session.
 * We add an extra middleware to grab the originating URL info if passed
 * to us on referrer.
 */
router.get('/logout', authenticate(), logout);

/**
 * Provide SAML Metadata for our SP
 */
router.get('/metadata', (req, res) => {
  res.type('application/xml');
  res.status(200).send(samlMetadata());
});

module.exports = router;
