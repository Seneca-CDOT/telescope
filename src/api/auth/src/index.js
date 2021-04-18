const { Satellite, Redis } = require('@senecacdot/satellite');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// Setup SAML SSO-based Authentication
require('./authentication');

const service = new Satellite({
  router: require('./routes'),
  beforeRouter(app) {
    // Initialize and use Session and Passport middleware on the app. In production
    // we use Redis for session storage, and in-memory otherwise.
    app.use(
      session({
        store: process.env.NODE_ENV === 'production' && new RedisStore({ client: Redis() }),
        secret: process.env.SECRET || `telescope-has-many-secrets-${Date.now()}!`,
        resave: false,
        saveUninitialized: false,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
  },
});

module.exports = service;
