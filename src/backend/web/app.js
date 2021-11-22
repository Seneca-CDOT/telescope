const express = require('express');
const session = require('express-session');
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
              scriptSrc: [
                "'self'",
                // proxying webpack's dev server requires unsafe-eval, see:
                // https://github.com/vercel/next.js/issues/7457#issuecomment-497092526
                "'unsafe-eval'",
              ],
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// Add our logger to the app
app.set('logger', logger);
app.use(logger);

// Include our router with all endpoints
app.use('/', router);

/**
 * Error Handler, Pass to front-end
 */
// eslint-disable no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.logger.error({ error: err });

  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status || 500;
  res
    .status(status)
    .redirect(`/error?status=${status}${err.message ? `&message=${encodeURI(err.message)}` : ``}`);
};
app.use(errorHandler);

/**
 * 404 Handler, Pass to front-end
 * Leverage .status because adding the `404` status in redirect causes "Not Found. Redirecting to /404?search=" to display.
 */
app.use((req, res) => {
  logger.logger.warn(`Attempted to access the following unknown URL: ${req.url}`);
  res.status(404).redirect(`/error?status=404`);
});

module.exports = app;
