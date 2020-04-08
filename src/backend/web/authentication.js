/**
 * SAML2 SSO Passport.js authentication strategy. See this post for details:
 *
 * https://blog.humphd.org/not-so-simple-saml/
 */

const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

const { logger } = require('../utils/logger');
const hash = require('../data/hash');
const User = require('../data/user');

/**
 * Get our SSO/SLO/SAML/Auth env variables, and warn if any are missing
 */
function getAuthEnv() {
  const {
    SAML_ENTITY_ID,
    SSO_IDP_PUBLIC_KEY_CERT,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
  } = process.env;

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
      '\n\n\t💡  It appears that you have not yet configured SAML auth .env variables.',
      '\n\t   Please refer to our documentation regarding SAML auth environment configuration:',
      '\n\t   https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md#saml-setup\n'
    );
  }

  return {
    SAML_ENTITY_ID,
    SSO_IDP_PUBLIC_KEY_CERT,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
  };
}

// Our SamlStrategy instance. Created by init() and exposed as `.strategy`
let strategy;

function init() {
  // Confirm we have all the environment variables we expect
  const {
    SAML_ENTITY_ID,
    SSO_IDP_PUBLIC_KEY_CERT,
    SSO_LOGIN_URL,
    SSO_LOGIN_CALLBACK_URL,
    SLO_LOGOUT_URL,
    SLO_LOGOUT_CALLBACK_URL,
  } = getAuthEnv();

  // Add session user object de/serialize functions. We put the whole
  // user object on the session unaltered.
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, new User(user.name, user.email, user.id));
  });

  // Setup SAML authentication strategy
  strategy = new SamlStrategy(
    {
      // See param details at https://github.com/bergie/passport-saml#config-parameter-details
      logoutUrl: SLO_LOGOUT_URL,
      logoutCallbackUrl: SLO_LOGOUT_CALLBACK_URL,
      entryPoint: SSO_LOGIN_URL,
      callbackUrl: SSO_LOGIN_CALLBACK_URL,
      issuer: SAML_ENTITY_ID,
      cert: SSO_IDP_PUBLIC_KEY_CERT,
      // https://github.com/bergie/passport-saml/issues/226
      disableRequestedAuthnContext: true,
      signatureAlgorithm: 'sha256',
    },
    function (profile, done) {
      if (!profile) {
        const error = new Error('SAML Strategy verify callback missing user profile');
        logger.error({ error });
        return done(error);
      }

      // We only use the displayname, emailaddress, and nameID (hashed, for use in our db)
      return done(null, {
        name: profile['http://schemas.microsoft.com/identity/claims/displayname'],
        email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        id: hash(profile.nameID),
      });
    }
  );

  passport.use(strategy);
}

/**
 * Generate SAML metadata XML
 */
function samlMetadata() {
  return strategy.generateServiceProviderMetadata();
}

// If user is not authenticated, remember where they were trying to go
// and let passport do full authentication and give chance to log in.
function protectWithRedirect(req, res, next) {
  if (req.session) {
    req.session.returnTo = req.originalUrl;
  }
  passport.authenticate('saml')(req, res, next);
}

// If user is not authenticated, return an appropriate 400 error type
function forbidden(req, res) {
  if (req.accepts('json')) {
    res.status(403).json({
      message: 'Forbidden',
    });
  } else {
    // TODO: https://github.com/Seneca-CDOT/telescope/issues/890
    res.status(403).send('Forbidden');
  }
}

// If we aren't redirecting, we're going to forbid this request
function protectWithoutRedirect(req, res) {
  forbidden(req, res);
}

/**
 * Check whether a user is authenticated.  If `requireAdmin` is `true`,
 * we also require that this user be an administrator.  If `redirect` is
 * `true`, we will send the request to the login page if not authenticated,
 * otherwise we fail it with a 403.
 */
function checkUser(requireAdmin, redirect, req, res, next) {
  // First, see if the user is already authenticated
  if (req.isAuthenticated()) {
    // Next, check to see if we need admin rights to pass
    if (requireAdmin) {
      // See if this user is an admin
      if (req.user.isAdmin) {
        next();
      }
      // Not an admin, so fail this now using best response type
      else {
        forbidden(req, res);
      }
    } else {
      // We don't need an admin, and this is a regular authenticated user, let it pass
      next();
    }
  }
  // If not authenticated, pick the right way to handle this with respect to redirects
  else if (redirect) {
    protectWithRedirect(req, res, next);
  } else {
    protectWithoutRedirect(req, res, next);
  }
}

/**
 * We define an administrator as someone who is specified in the .env
 * ADMINISTRATORS variable list. We support bare email addresses and hashed.
 * See env.sample for more details.
 */
function getAdminList(administrators) {
  return administrators ? administrators.split(' ') : [];
}
const admins = getAdminList(process.env.ADMINISTRATORS);

// See if this user id is in the admins env as a raw or hashed value
function userIsAdmin(id) {
  return admins.some((admin) => id === admin || id === hash(admin));
}

/**
 * Middleware to determine if a user on the session is an administrator or not.
 * In both cases, we add an `.isAdmin` property, and set it to `true` only if
 * the current user's id (i.e. ,nameID in SAML) matches what we have set in the
 * env for ADMINISTRATORS.  There can be more than one admin user.  After this
 * middleware updates the `user`, you can use `req.user.isAdmin` to check whether
 * or not a user is an administrator.
 */
function administration() {
  return function (req, res, next) {
    if (req.user && req.user.id) {
      req.user.isAdmin = userIsAdmin(req.user.id);
    }
    next();
  };
}

/**
 * Middleware to make sure that a route is authenticated. If the user is
 * already authenticated, your route will be called. If the user is already
 * authenticated, the next() route will be be called, otherwise an HTTP 403
 * will be returned on the response. This is probably what you want for a
 * REST API endpoint.
 *
 * If you want to give the user a chance to log in (e.g., web page vs. REST
 * API endpoint), you can pass `true` to protect
 *
 * To use:
 *
 * router.get('/rest/api', protect(), function(res, res) { ... }))
 *
 * router.get('/protected/html/page', protect(true), function(res, res) { ... }))
 */
function protect(redirect) {
  return function (req, res, next) {
    checkUser(false, redirect, req, res, next);
  };
}

/**
 * Middleware to make sure that a route is authenticated AND that the
 * user is a member of the admins we define in our env.  See protect() above
 * for more details on how this middle should be used in general.
 *
 * To use:
 *
 * router.get('/rest/api/for/admins', protectAdmin(), function(res, res) { ... }))
 *
 * router.get('/protected/html/page/for/admins', protectAdmin(true), function(res, res) { ... }))
 */
function protectAdmin(redirect) {
  return function (req, res, next) {
    checkUser(true, redirect, req, res, next);
  };
}

module.exports.init = init;
module.exports.protect = protect;
module.exports.protectAdmin = protectAdmin;
module.exports.administration = administration;
module.exports.samlMetadata = samlMetadata;
