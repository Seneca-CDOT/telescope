/**
 * SAML2 SSO Passport.js authentication strategy
 */

const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const path = require('path');

const { logger } = require('../utils/logger');
const hash = require('../data/hash');

/**
 * Get our SSO/SLO/SAML/Auth env variables, and warn if any are missing
 */
function getAuthEnv() {
  const {
    SAML2_CLIENT_ID,
    SAML2_CLIENT_SECRET,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
    CERTS_PATH,
  } = process.env;

  if (
    !(
      SAML2_CLIENT_ID &&
      SAML2_CLIENT_SECRET &&
      SSO_LOGIN_URL &&
      SSO_LOGIN_CALLBACK_URL &&
      SLO_LOGOUT_URL &&
      SLO_LOGOUT_CALLBACK_URL &&
      CERTS_PATH
    )
  ) {
    logger.error(
      '\n\n\t💡  It appears that you have not yet configured SAML auth .env variables.',
      '\n\t   Please refer to our documentation regarding SAML auth environment configuration:',
      '\n\t   https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md#saml-setup\n'
    );
  }

  return {
    SAML2_CLIENT_ID,
    SAML2_CLIENT_SECRET,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
    CERTS_PATH,
  };
}

// TODO: figure out our cert/key loading
let cert;

function getCert(certPath) {
  if (cert) {
    return cert;
  }

  try {
    cert = fs.readFileSync(path.resolve(process.cwd(), `${certPath}/key.pem`), 'utf8');
  } catch (error) {
    logger.error({ error }, 'Unable to load certs/key.pem');
  }

  return cert;
}

// Our SamlStrategy instance. Created by init() and exposed as `.strategy`
let strategy;

function init(passport) {
  // Confirm we have all the environment variables we expect
  const {
    SAML2_CLIENT_ID,
    SAML2_CLIENT_SECRET,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
    CERTS_PATH,
  } = getAuthEnv();

  // Add session user object de/serialize functions
  passport.serializeUser(function(user, done) {
    // TODO: is it necessary to use JSON vs. Object?
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function(json, done) {
    // TODO: is it necessary to use JSON vs. Object?
    try {
      const user = JSON.parse(json);
      done(null, user);
    } catch (error) {
      logger.error({ error }, `Error deserializing user json: got '${json}'`);
      done(error);
    }
  });

  // Setup SAML authentication strategy
  strategy = new SamlStrategy(
    {
      // See param details at https://github.com/bergie/passport-saml#config-parameter-details
      logoutUrl: SLO_LOGOUT_URL,
      logoutCallbackUrl: SLO_LOGOUT_CALLBACK_URL,
      entryPoint: SSO_LOGIN_URL,
      callbackUrl: SSO_LOGIN_CALLBACK_URL,
      issuer: SAML2_CLIENT_ID,
      // TODO: this isn't right yet.  See https://github.com/bergie/passport-saml#security-and-signatures
      decryptionPvk: getCert(CERTS_PATH),
      privateCert: getCert(CERTS_PATH),
    },
    function(profile, done) {
      // TODO: we can probably pick off the user data we actually need here...
      if (!profile) {
        const error = new Error('SAML Strategy verify callback missing profile');
        logger.error({ error });
        done(error);
      } else {
        done(null, profile);
      }
    }
  );

  passport.use(strategy);

  // Give back the session secret to use
  return SAML2_CLIENT_SECRET || hash(`secret-${Date.now()}!`);
}

function samlMetadata() {
  // I need to get the decryptionCert vs signingCert sorted out here...
  // https://github.com/bergie/passport-saml#generateserviceprovidermetadata-decryptioncert-signingcert-
  return strategy.generateServiceProviderMetadata(getCert(), getCert());
}

/**
 * Middleware to make sure that a route is authenticated. If the user is
 * already authenticated, your route will be called. If the user is already
 * authenticated, the next() route will be be called, otherwise an HTTP 401
 * Unauthorized will be returned on the response. This is probably what you
 * want for a REST API endpoint.
 *
 * To use:
 *
 * router.get('/your/route', protect, function(res, res) { ... }))
 */
function protect(req, res, next) {
  // If the user is already authenticated, let this pass to next route
  if (req.isAuthenticated()) {
    next();
  } else {
    // TODO: should probably send appropriate response type (HTML, JSON, etc.)
    res.status(401).send('Unauthorized');
  }
}

module.exports.init = init;
module.exports.protect = protect;
module.exports.strategy = strategy;
module.exports.samlMetadata = samlMetadata;
