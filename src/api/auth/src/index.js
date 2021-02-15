const { Satellite } = require('@senecacdot/satellite');
const passport = require('passport');
const session = require('express-session');

// Setup SAML SSO-based Authentication
require('./authentication');
// Setup JWT-based Authorization
require('./authorization');
const routes = require('./routes');

const service = new Satellite({
  router: routes,
  beforeRouter(app) {
    // Initialize and use Session and Passport middleware on the app
    app.use(
      // TODO: should use RedisStore in prod
      session({
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
