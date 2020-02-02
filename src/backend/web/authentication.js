const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const path = require('path');

const { logger } = require('../utils/logger');
const hash = require('../data/hash');

const telescopeLoginUrl = '/auth/login';

/**
 * Get our SAML Auth env variables, and warn if any are missing
 */
function getAuthEnv() {
  const { SAML2_BASE_URI, SAML2_REDIRECT_URI, SAML2_CLIENT_ID, SAML2_CLIENT_SECRET } = process.env;

  if (!(SAML2_BASE_URI && SAML2_REDIRECT_URI && SAML2_CLIENT_ID && SAML2_CLIENT_SECRET)) {
    logger.error(
      '\n\n\t💡  It appears that you have not yet configured SAML auth .env variables.',
      '\n\t   Please refer to our documentation regarding SAML auth environment configuration:',
      '\n\t   https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md#saml-setup\n'
    );
  }

  return { SAML2_BASE_URI, SAML2_REDIRECT_URI, SAML2_CLIENT_ID, SAML2_CLIENT_SECRET };
}

function init(passport) {
  // Confirm we have all the environment variables we expect
  const { SAML2_BASE_URI, SAML2_REDIRECT_URI, SAML2_CLIENT_ID, SAML2_CLIENT_SECRET } = getAuthEnv();

  // Load certs
  let cert = null;
  try {
    cert = fs.readFileSync(path.resolve(process.cwd(), './certs/key.pem'), 'utf8');
  } catch (error) {
    logger.error({ error }, 'Unable to load certs/key.pem');
  }

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
  passport.use(
    new SamlStrategy(
      {
        // See param details at https://github.com/bergie/passport-saml#config-parameter-details
        callbackUrl: SAML2_REDIRECT_URI,
        entryPoint: SAML2_BASE_URI,
        issuer: SAML2_CLIENT_ID,
        // TODO: why do both of these point to the same thing?  Do we need both?
        decryptionPvk: cert,
        privateCert: cert,
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
    )
  );

  // Give back the session secret to use
  return SAML2_CLIENT_SECRET || hash(`secret-${Date.now()}!`);
}

/**
 * Middleware to make sure that a route is authenticated. If the user is
 * already authenticated, your route will be called.  If not, the user will
 * be redirected to the login page.  To use it:
 *
 * router.get('/your/route', authenticateUser, function(res, res) { ... }))
 *
 * By default, the request will be redirected.  Pass false if you want to just
 * return a 401.
 */
function authenticateUser(redirect = true) {
  return function(req, res, next) {
    // If the user is already authenticated, let this pass to next route
    if (req.isAuthenticated()) {
      next();
      return;
    }

    // If redirect is false, send a 401
    if (!redirect) {
      // TODO: should probably allow sending HTML, JSON, etc.
      res.status(401).send('Unauthorized');
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
  };
}

module.exports.init = init;
module.exports.authenticateUser = authenticateUser;
