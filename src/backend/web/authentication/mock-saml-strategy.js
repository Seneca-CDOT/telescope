/**
 * Provide a mock passport-saml strategy. See mock-user.json
 * for user info and to add extra properties.
 *
 * NOTE: Passport needs certain things our eslint setup doesn't like.
 */

/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/prefer-await-to-callbacks */

const passport = require('passport-strategy');

const util = require('util');

/**
 * If you need to add any extra properties or data to our mock user,
 * do it in mock-user.json.
 */
const mockUser = require('./mock-user.json');

/**
 * Keep a global logged in/logged out state for our one fake user.
 * Callers can use MockSamlStrategy.login() and MockSamlStrategy.login()
 * to change this.
 */
let isLoggedIn = false;

function MockSamlStrategy(options, verify) {
  // pretend to be a saml stragegy
  this.name = 'saml';
  this._user = mockUser;
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback || false;
  passport.Strategy.call(this);
}

util.inherits(MockSamlStrategy, passport.Strategy);

// https://github.com/cszatma/passport-mock-strategy/blob/master/src/passport-mock-strategy.ts
MockSamlStrategy.prototype.authenticate = function(req) {
  if (!this._verify) {
    if (isLoggedIn) {
      return this.success(this._user);
    }
    return this.fail('not logged in');
  }

  const verified = (error, user, info) => {
    if (error) {
      return this.error(error);
    }

    if (!user || !isLoggedIn) {
      return this.fail(info);
    }

    return this.success(user, info);
  };

  try {
    if (this._passReqToCallback && req) {
      return this._verify(req, this._user, verified);
    }
    return this._verify(this._user, verified);
  } catch (e) {
    return this.error(e);
  }
};

MockSamlStrategy.prototype.logout = function(req, callback) {
  callback(null, '/');
};

MockSamlStrategy.prototype.generateServiceProviderMetadata = function() {
  return 'saml-metadata-xml';
};

/**
 * Manage isLoggedIn state for our fake user.
 */
MockSamlStrategy.login = function() {
  isLoggedIn = true;
};
MockSamlStrategy.logout = function() {
  isLoggedIn = false;
};

module.exports = MockSamlStrategy;
