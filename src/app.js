const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const createError = require('http-errors');
const expressPino = require('express-pino-logger');

const logger = require('./logger');
const { errorHandler } = require('./middleware');

function createApp(router, options = {}) {
  const app = express();

  app.use(expressPino({ logger }));

  // Allow disabling or passing options to helmet
  if (options.helmet !== false) {
    app.use(helmet(options.helmet));
  }

  // Allow disabling or passing options to cors
  if (options.cors !== false) {
    app.use(cors(options.cors));
  }

  // If beforeParsers is defined, add all middleware to the app
  // before we define the parsers.  Useful for session, passport, etc.
  if (typeof options.beforeParsers === 'function') {
    options.beforeParsers(app);
  }

  // Parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // Parse application/json
  app.use(express.json());

  // Allow adding auto-opt-out of FLoC (disabled by default)
  if (options.optOutFloc) {
    app.use((req, res, next) => {
      res.setHeader('Permissions-Policy', 'interest-cohort=()');
      next();
    });
  }

  // If beforeRouter is defined, add all middleware to the app
  // before we define the router. Useful for adding middleware just
  // before the router.
  if (typeof options.beforeRouter === 'function') {
    options.beforeRouter(app);
  }

  // Include our router with all endpoints added by the user
  app.use('/', router);

  // 404
  app.use(function (req, res, next) {
    next(createError(404, `${req.originalUrl} not found`));
  });

  // Add our default error handler
  app.use(errorHandler);

  return app;
}

// Always merge params with the parent routes we're joining
function createRouter(options) {
  return express.Router({ ...options, mergeParams: true });
}

module.exports.createApp = createApp;
module.exports.createRouter = createRouter;
