/**
 * Mock SAML2 SSO Passport.js authentication strategy.
 */
const hash = require('../../data/hash');
const User = require('../../data/user');
const Admin = require('../../data/admin');

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
  return loggedInUser;
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

/**
 * If we're logged in, build and return the appropriate user type (User vs. Admin).
 * If we're not logged in, return null.
 */
function createUser() {
  if (!loggedInUser) {
    return null;
  }

  // Hard-code required fields that we need internally, but don't use in mocks
  const nameID = loggedInUser.email;
  const nameIDFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';

  if (loggedInUser.isAdmin) {
    return new Admin(loggedInUser.name, loggedInUser.email, loggedInUser.id, nameID, nameIDFormat);
  }
  return new User(loggedInUser.name, loggedInUser.email, loggedInUser.id, nameID, nameIDFormat);
}

function protect(redirect) {
  return function (req, res, next) {
    req.user = createUser();
    checkUser(false, redirect, req, res, next);
  };
}

function protectAdmin(redirect) {
  return function (req, res, next) {
    req.user = createUser();
    checkUser(true, redirect, req, res, next);
  };
}

module.exports.init = init;
module.exports.protect = protect;
module.exports.protectAdmin = protectAdmin;
module.exports.samlMetadata = samlMetadata;
