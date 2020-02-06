const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const path = require('path');

const { logger } = require('../utils/logger');
const hash = require('../data/hash');

const telescopeLoginUrl = '/auth/login';

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
  } = process.env;

  if (
    !(
      SAML2_CLIENT_ID &&
      SAML2_CLIENT_SECRET &&
      SSO_LOGIN_URL &&
      SSO_LOGIN_CALLBACK_URL &&
      SLO_LOGOUT_URL &&
      SLO_LOGOUT_CALLBACK_URL
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
  };
}

// TODO: figure out our cert/key loading
let cert;

function getCert() {
  if (cert) {
    return cert;
  }

  try {
    cert = fs.readFileSync(path.resolve(process.cwd(), './certs/key.pem'), 'utf8');
  } catch (error) {
    logger.error({ error }, 'Unable to load certs/key.pem');
  }

  return cert;
}

try {
  cert = fs.readFileSync(path.resolve(process.cwd(), './certs/key.pem'), 'utf8');
} catch (error) {
  logger.error({ error }, 'Unable to load certs/key.pem');
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
      decryptionPvk: getCert(),
      privateCert: getCert(),
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

/**
 * Middleware to make sure that a route is authenticated. If the user is
 * already authenticated, your route will be called.
 *
 * Depending on the route, and whether it is being called by a user
 * or as part of a REST API, you can use one of the following:
 *
 *
 * - authenticate: if the user is already authenticated, the next() route
 *   will be be called, otherwise an HTTP 401 Unauthorized will be returned
 *   on the response. This is probably what you want for a REST API endpoint.
 *
 * - authenticateWithRedirect: if the user is already authenticated, the next()
 *   route will be be called, otherwise the user will be redirected to the SSO
 *   login page, where they can authenticate and try again. When they finish
 *   logging in, they will be redirected to the original path they were trying
 *   to access.
 *
 * To use these:
 *
 * router.get('/your/route', authenticate, function(res, res) { ... }))
 */
function authenticate(req, res, next) {
  // If the user is already authenticated, let this pass to next route
  if (req.isAuthenticated()) {
    next();
  } else {
    // TODO: should probably send appropriate response type (HTML, JSON, etc.)
    res.status(401).send('Unauthorized');
  }
}

function authenticateWithRedirect(req, res, next) {
  // If the user is already authenticated, let this pass to next route
  if (req.isAuthenticated()) {
    next();
    return;
  }

  // Redirect the unauthenticated user to our SSO provider
  if (req.session) {
    // Remember where we were trying to go before logging in so we can get back there
    req.session.returnTo = req.originalUrl;
  } else {
    logger.warn('SAML - authenticateUser: No session property on request!');
  }
  res.redirect(telescopeLoginUrl);
}

function samlMetadata() {
  // I need to get the decryptionCert vs signingCert sorted out here...
  // https://github.com/bergie/passport-saml#generateserviceprovidermetadata-decryptioncert-signingcert-
  return strategy.generateServiceProviderMetadata(getCert(), getCert());
}

module.exports.init = init;
module.exports.strategy = strategy;
module.exports.samlMetadata = samlMetadata;
module.exports.authenticate = authenticate;
module.exports.authenticateWithRedirect = authenticateWithRedirect;
