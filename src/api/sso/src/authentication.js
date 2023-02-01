/**
 * SAML2 SSO Passport.js Authentication strategy. See this post for details:
 *
 * https://blog.humphd.org/not-so-simple-saml/
 */
const passport = require('passport');
const SamlStrategy = require('@node-saml/passport-saml').Strategy;
const { logger, hash } = require('@senecacdot/satellite');

const supabase = require('./supabase');
const User = require('./user');

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
  done(null, User.parse(user));
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
  function (senecaProfile, done) {
    if (
      !(
        senecaProfile &&
        senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      )
    ) {
      const error = new Error(
        'SAML Strategy verify callback missing user profile and emailaddress claim'
      );
      logger.error({ error });
      done(error);
      return;
    }

    /**
     * The profile object we get back from Seneca takes this form:
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
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname: "Johannes",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Kepler",
     *   "http://schemas.microsoft.com/identity/claims/displayname": "First Last",
     *   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "first.last@email.com"
     *   "email": "first.last@email.com"
     * }
     *
     * We only really care about the emailaddress claim, which we also use in the Users service.
     */
    const email =
      senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

    async function lookupTelescopeUser(id) {
      // We have the user's id (i.e. their hashed email address). Now
      // make a request to the Supabase service in order to
      // get this user's full profile information using the user's id.  They
      // may or may not have a Telescope profile (yet).
      try {
        const { data: profiles, error } = await supabase
          .from('telescope_profiles')
          .select('*')
          .eq('id', id)
          .limit(1);

        if (error) {
          // We can't get a response from the Supabase, so we don't know what we have.
          throw new Error(`unable to get user info from Supabase: ${error.message}`);
        }
        if (!profiles.length) {
          // No Telescope user profile found, so create a regular Seneca user
          logger.debug({ senecaProfile }, `No Telescope account with id : ${id}`);
          done(null, new User(senecaProfile));
          return;
        }

        // If we get back profile data from Supabase, parse and use
        const telescopeProfile = User.parseTelescopeUser(profiles[0]);
        logger.debug({ senecaProfile, telescopeProfile }, 'Telescope user authenticated');
        done(null, new User(senecaProfile, telescopeProfile));
      } catch (err) {
        logger.error({ err });
        done(err, false);
      }
    }

    lookupTelescopeUser(hash(email));
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
