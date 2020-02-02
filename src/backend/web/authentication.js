const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const path = require('path');

const { logger } = require('../utils/logger');
const hash = require('../data/hash');

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
    logger.debug({ user }, 'Serialize user');
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    logger.debug({ user }, 'Deserialize user');
    done(null, user);
  });

  // Setup SAML authentication strategy
  passport.use(
    new SamlStrategy(
      {
        // See param details at https://github.com/bergie/passport-saml#config-parameter-details
        callbackUrl: SAML2_REDIRECT_URI,
        entryPoint: SAML2_BASE_URI,
        issuer: SAML2_CLIENT_ID, // was 'saml-poc'
        // identifierFormat: null, // do we need this?
        // Why do both of these point to the same thing?  Do we need both?
        decryptionPvk: cert,
        privateCert: cert,
      },
      function(profile, done) {
        // TODO: we can probably pick off the data we need vs. using everything
        return done(null, profile);
      }
    )
  );

  // Return the secret to use on the session.  Don't crash if missing this.
  // TODO: I need this to pass CI, but it's not good enough.
  return SAML2_CLIENT_SECRET || hash(`Set a better secret than this ${Date.now()}!`);
}

module.exports.init = init;
