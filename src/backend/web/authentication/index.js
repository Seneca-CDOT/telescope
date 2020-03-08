/**
 * SAML2 SSO Passport.js authentication strategy
 */

const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');

const { logger } = require('../../utils/logger');
const hash = require('../../data/hash');

/**
 * Get our SSO/SLO/SAML/Auth env variables, and warn if any are missing
 */
function getAuthEnv() {
  const {
    SAML2_CLIENT_ID,
    SAML2_CLIENT_SECRET,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SSO_IDP_CERT_PEM_FILE,
    SSO_PRIVATE_CERT_PEM_FILE,
    SSO_PRIVATE_KEY_PEM_FILE,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
  } = process.env;

  if (
    !(
      SAML2_CLIENT_ID &&
      SAML2_CLIENT_SECRET &&
      SSO_LOGIN_URL &&
      SSO_LOGIN_CALLBACK_URL &&
      SSO_IDP_CERT_PEM_FILE &&
      SSO_PRIVATE_CERT_PEM_FILE &&
      SSO_PRIVATE_KEY_PEM_FILE &&
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
    SAML2_CLIENT_ID: SAML2_CLIENT_ID || 'telescope',
    SAML2_CLIENT_SECRET: SAML2_CLIENT_SECRET || hash(`secret-${Date.now()}!`),
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SSO_IDP_CERT_PEM_FILE,
    SSO_PRIVATE_CERT_PEM_FILE,
    SSO_PRIVATE_KEY_PEM_FILE,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
  };
}

/**
 * Read and process a PEM-encoded X.509 signing certificate, extracting
 * the portion between "BEGIN CERTIFICATE" and "END CERTIFICATE".
 * If the certificate is already a single line, we'll use it as is.
 */
function readCert(filename) {
  let cert = fs.readFileSync(filename, 'utf8');
  // Strip containing CERTIFICATE wrapper
  cert = cert.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '');
  // Join into a single line if split
  cert = cert.replace(/\r?\n/, '');

  return cert;
}

/**
 * Our public certificate so that we can get a private key to sign SAML Requests.
 * We need our public PEM-encoded X.509 signing certificate, and we use the portion
 * between "PRIVATE KEY" and "END PRIVATE KEY". This is then used to obtain the
 * private cert. In the end we want a String in the following form:
 *
 * privateCert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqh ... W=='
 *
 * If the certificate is already a single line, we'll use it as is.
 */
function getPrivateKey(filename) {
  let cert = fs.readFileSync(filename, 'utf8');
  // Strip containing CERTIFICATE wrapper
  cert = cert.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '');
  // Join into a single line if split
  cert = cert.replace(/\r?\n/, '');

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
    SSO_IDP_CERT_PEM_FILE,
    SSO_PRIVATE_KEY_PEM_FILE,
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
  try {
    strategy = new SamlStrategy(
      {
        // See param details at https://github.com/bergie/passport-saml#config-parameter-details
        logoutUrl: SLO_LOGOUT_URL,
        logoutCallbackUrl: SLO_LOGOUT_CALLBACK_URL,
        entryPoint: SSO_LOGIN_URL,
        callbackUrl: SSO_LOGIN_CALLBACK_URL,
        issuer: SAML2_CLIENT_ID,
        cert: readCert(SSO_IDP_CERT_PEM_FILE),
        decryptionPvk: getPrivateKey(SSO_PRIVATE_KEY_PEM_FILE),
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
  } catch (error) {
    logger.error({ error }, 'Unable to initialize SAML Strategy');
    throw error;
  }

  passport.use(strategy);

  // Give back the session secret to use
  return SAML2_CLIENT_SECRET;
}

function samlMetadata() {
  const { SSO_PRIVATE_CERT_PEM_FILE } = getAuthEnv();

  // I need to get the decryptionCert vs signingCert sorted out here...
  // https://github.com/bergie/passport-saml#generateserviceprovidermetadata-decryptioncert-signingcert-
  return strategy.generateServiceProviderMetadata(readCert(SSO_PRIVATE_CERT_PEM_FILE));
}

module.exports.init = init;
module.exports.strategy = strategy;
module.exports.samlMetadata = samlMetadata;
