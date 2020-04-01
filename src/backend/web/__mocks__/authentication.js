/**
 * Mock SAML2 SSO Passport.js authentication strategy.
 */
const hash = require('../../data/hash');

let loggedInUser;

/**
 * Override init() to provide login for tests
 */
function init(name, email, isAdmin = false) {
  if (arguments.length >= 2) {
    // Log in
    loggedInUser = {
      id: hash(email),
      name,
      email,
      isAdmin,
    };
  } else {
    // Log out
    loggedInUser = null;
  }
}

function samlMetadata() {
  return 'metadata';
}

// If user is not authenticated, return an appropriate 400 error type
function forbidden(req, res) {
  if (req.accepts('json')) {
    res.status(403).json({
      message: 'Forbidden',
    });
  } else {
    res.status(403).send('Forbidden');
  }
}

function checkUser(requireAdmin, redirect, req, res, next) {
  // First, see if the user is authenticated
  if (loggedInUser) {
    // Next, check to see if we need admin rights to pass
    if (requireAdmin) {
      // See if this user is an admin
      if (loggedInUser.isAdmin) {
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
  } else {
    forbidden(req, res);
  }
}

// We'll deal with admin via init(), just let this pass
function administration() {
  return function(req, res, next) {
    next();
  };
}

function protect(redirect) {
  return function(req, res, next) {
    checkUser(false, redirect, req, res, next);
  };
}

function protectAdmin(redirect) {
  return function(req, res, next) {
    checkUser(true, redirect, req, res, next);
  };
}

module.exports.init = init;
module.exports.protect = protect;
module.exports.protectAdmin = protectAdmin;
module.exports.administration = administration;
module.exports.samlMetadata = samlMetadata;
