const minimatch = require('minimatch');

// Check to see if an origin matches the list of allowed origins we have.
// If any of the allowed origins includes a '*' wildcard, we do a fuzzy match,
// otherwise we do a full match
module.exports.matchOrigin = (origin, allowedOrigins) =>
  allowedOrigins.some((allowedOrigin) => {
    // If there's a '*' character, try a fuzzy match
    if (allowedOrigin.includes('*')) {
      return minimatch(origin, allowedOrigin);
    }
    // Otherwise, do a full comparison
    return origin === allowedOrigin;
  });
