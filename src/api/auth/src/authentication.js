/**
 * SAML2 SSO Passport.js Authentication strategy. See this post for details:
 *
 * https://blog.humphd.org/not-so-simple-saml/
 */

const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const { logger, hash } = require('@senecacdot/satellite');
const User = require('./user');
const Admin = require('./admin');

const {
  SAML_ENTITY_ID,
  SSO_IDP_PUBLIC_KEY_CERT,
  SSO_LOGIN_URL,
  SSO_LOGIN_CALLBACK_URL,
  SLO_LOGOUT_URL,
  SLO_LOGOUT_CALLBACK_URL,
} = process.env;

/**
 * Get our SSO/SLO/SAML/Auth env variables, and warn if any are missing
 */
if (
  !(
    SAML_ENTITY_ID &&
    SSO_IDP_PUBLIC_KEY_CERT &&
    SSO_LOGIN_URL &&
    SSO_LOGIN_CALLBACK_URL &&
    SLO_LOGOUT_URL &&
    SLO_LOGOUT_CALLBACK_URL
  )
) {
  logger.error(
    'Missing environment variables. Refer to https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md#saml-setup'
  );
}

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  /**
   * We need to rehydrate a full user Object, using one of User or Admin.  To do
   * so we determine this based on the current user's id (i.e. nameID in SAML)
   * matching what we have set in the env for ADMINISTRATORS.  There can be
   * more than one admin user.
   */
  if (Admin.isAdmin(user.id)) {
    done(null, new Admin(user.name, user.email, user.id, user.nameID, user.nameIDFormat));
  } else {
    done(null, new User(user.name, user.email, user.id, user.nameID, user.nameIDFormat));
  }
});

// Setup SAML authentication strategy
const strategy = new SamlStrategy(
  {
    // See param details at https://github.com/bergie/passport-saml#config-parameter-details
    logoutUrl: SLO_LOGOUT_URL,
    logoutCallbackUrl: SLO_LOGOUT_CALLBACK_URL,
    entryPoint: SSO_LOGIN_URL,
    callbackUrl: SSO_LOGIN_CALLBACK_URL,
    issuer: SAML_ENTITY_ID,
    cert: SSO_IDP_PUBLIC_KEY_CERT,
    disableRequestedAuthnContext: true,
    signatureAlgorithm: 'sha256',
  },
  (profile, done) => {
    if (!profile) {
      const error = new Error('SAML Strategy verify callback missing user profile');
      logger.error({ error });
      return done(error);
    }

    /**
     * The object we get back from Seneca takes this form:
     * {
     *   "issuer": "https://sts.windows.net/...",
     *   "inResponseTo": "_851650d2472d2921c6ac",
     *   "sessionIndex": "_dfa0c21c-b4d6-43cb-a277-2cf456d43600",
     *   "nameID": "first.last@senecacollege.ca",
     *   "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
     *   "http://schemas.microsoft.com/identity/claims/tenantid": "3dd...",
     *   "http://schemas.microsoft.com/identity/claims/objectidentifier": "4b4a05ff-04a4-49d9-91b8-1f92d2077f80",
     *   "http://schemas.microsoft.com/identity/claims/displayname": "First Last",
     *   "http://schemas.microsoft.com/identity/claims/identityprovider": "https://sts...",
     *   "http://schemas.microsoft.com/claims/authnmethodsreferences": "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "First",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Last",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "first.last@senecacollege.ca",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "first.last@senecacollege.ca",
     * }
     *
     * The SimpleSamlPHP testing IdP looks like this:
     *
     * {
     *   "issuer": "https://localhost:8443/simplesaml/saml2/idp/metadata.php",
     *   "sessionIndex": "_db0e7ecb9c82615a9abf21f0fc97c39b5b3e5857d0",
     *   "nameID": "_566172266563daa8980f7a8fa73a6ef45172aac020",
     *   "nameIDFormat": "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
     *   "spNameQualifier": "...",
     *   "uid": "1",
     *   "eduPersonAffiliation": "group1",
     *   "http://schemas.microsoft.com/identity/claims/displayname": "First Last",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "first.last@email.com"
     *   "email": "first.last@email.com"
     * }
     */

    // We only use the displayname, emailaddress, and nameID info (hashed, for use in our db)
    return done(null, {
      // Include nameID so we can use it for Logout Requests back to the IdP.
      nameID: profile.nameID,
      nameIDFormat: profile.nameIDFormat,
      name: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      id: hash(profile.nameID),
    });
  }
);
passport.use(strategy);

/**
 * Generate SAML metadata XML
 */
function samlMetadata() {
  return strategy.generateServiceProviderMetadata();
}

module.exports.samlMetadata = samlMetadata;
