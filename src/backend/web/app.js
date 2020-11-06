const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const RedisStore = require('connect-redis')(session);
const { redis } = require('../lib/redis');

const logger = require('../utils/logger');
const authentication = require('./authentication');
const router = require('./routes');

const app = express();

/**
 * Use Helmet to secure our Express server.
 * To avoid CSP violations when loading GraphQL's playground,
 * 'cdn.jsdelivr.net' and 'unsafe-inline' were added to scriptSrc.
 * https://github.com/ctrlplusb/react-universally/issues/253#issuecomment-267669695
 */
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'development'
        ? {
            directives: {
              defaultSrc: ["'self'"],
              fontSrc: ["'self'", 'https:', 'data:'],
              frameSrc: ["'self'", '*.youtube.com', '*.vimeo.com'],
              frameAncestors: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              scriptSrc: ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
              styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
              objectSrc: ["'none'"],
              upgradeInsecureRequests: [],
            },
          }
        : undefined,
  })
);

// Enable CORS and preflight checks on all routes
const corsOptions = {
  exposedHeaders: ['X-Total-Count', 'Link'],
};
app.use(cors(corsOptions));

// Setup session and passport for authentication
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SECRET || `telescope-has-many-secrets-${Date.now()}!`,
    resave: false,
    saveUninitialized: false,
  })
);
authentication.init();
app.use(passport.initialize());
app.use(passport.session());

// Template rendering for legacy "planet" view of posts
app.engine('handlebars', expressHandlebars());
app.set('views', path.join(__dirname, 'planet/views'));
app.set('view engine', 'handlebars');

// Add our logger to the app
app.set('logger', logger);
app.use(logger);

// Include our router with all endpoints
app.use('/', router);

/**
 * Error Handler, Pass to front-end
 */
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  logger.logger.error({ error: err });
  const status = err.status || 500;
  res
    .status(status)
    .redirect(`/error?status=${status}${err.message ? `&message=${encodeURI(err.message)}` : ``}`);
});

/**
 * 404 Handler, Pass to front-end
 * Leverage .status because adding the `404` status in redirect causes "Not Found. Redirecting to /404?search=" to display.
 */
app.use((req, res) => {
  logger.logger.warn(`Attempted to access the following unknown URL: ${req.url}`);
  res.status(404).redirect(`/error?status=404`);
});

module.exports = app;
