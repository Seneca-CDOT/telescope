const passport = require('passport');

/**
 * Middleware to make sure that a route is protected, and the user
 * has already authenticated. If the user is already authenticated, the next
 * route will be called. If not, an HTTP 401 Unauthorized response will be
 * returned. This is probably what you want for a REST API endpoint.
 *
 * To use:
 *
 * router.get('/your/route', protect(), function(res, res) { ... }))
 */
function protect() {
  return function(req, res, next) {
    // If the user is already authenticated, let this pass to next route
    if (req.isAuthenticated()) {
      next();
    } else {
      // TODO: should probably send appropriate response type (HTML, JSON, etc.)
      res.status(401).send('Unauthorized');
    }
  };
}

/**
 * Authentication middleware, but remember where this login request came from.
 * Stash the original referrer in the SAML RelayState. When we get a response
 * in our callback, we'll pick it out of the POST data and redirect there vs /.
 * This is probably what you want for a user-accessible URL route vs. REST API.
 *
 * To use:
 *
 * router.get('/your/route', authenticate(), function(res, res) { ... }))
 */
function authenticate() {
  return function(req, res, next) {
    req.query.RelayState = req.get('Referrer');
    passport.authenticate('saml')(req, res, next);
  };
}

module.exports.protect = protect;
module.exports.authenticate = authenticate;
