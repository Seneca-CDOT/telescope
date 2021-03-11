// This needs to go first so it can instrument the app
// https://www.elastic.co/guide/en/apm/agent/nodejs/current/express.html
// To use, set the following environment variables:
//
// - ELASTIC_APM_SERVICE_NAME: the name of your service as it will appear in APM
// - ELASTIC_APM_SERVER_URL: the URL to the APM server (e.g., http://localhost:8200)
let apm;
// Only do this if we have an APM server config to work with.
if (
  process.env.ELASTIC_APM_SERVER_URL &&
  process.env.ELASTIC_APM_SERVICE_NAME
) {
  apm = require("elastic-apm-node").start({
    centralConfig: false,
  });
}

const { createServer } = require("http");
const { createTerminus } = require("@godaddy/terminus");
const express = require("express");
const jwt = require("express-jwt");
const cors = require("cors");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const path = require("path");
const createError = require("http-errors");
const pino = require("pino");
const expressPino = require("express-pino-logger");

let logger;
if (apm) {
  // Log with structured JSON in a format APM can consume
  logger = pino(require("@elastic/ecs-pino-format")({ convertReqRes: true }));
} else {
  // Use a less structured logger so it's easier to see debug output
  logger = pino({
    prettyPrint: {},
    prettifier: require("pino-colada"),
  });
}

/**
 * Hash function used to generate our unique data ids.
 * We use sha256 and encode in hex, so it's safe to use
 * in URLs. For example:
 *
 *   6Xoj0UXOW3FNirlSYranli5gY6dDq60hs24EIAcHAEc=
 *
 * but truncate to only use the first 10 characters
 * in order to reduce key sizes in Redis:
 *
 *   6Xoj0UXOW3
 *
 * This is fine for our needs, as we don't have enough
 * data to require the entire hash.
 */

function hash(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 10);
}

// JWT Validation Middleware. We expect to get config details via the env
function protectWithJwt() {
  return jwt({
    secret: process.env.SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    // TODO: proper public/private key token signing
    algorithms: ["HS256"],
  });
}

function createRouter(options, protect) {
  // Always merge params with the parent routes we're joining
  const router = express.Router({ ...options, mergeParams: true });

  // If this is to be a protected router, add JWT validation middleware
  if (protect) {
    router.use(protectWithJwt());
  }

  return router;
}

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

  // Allow disabling the favicon
  if (options.disableFavicon !== true) {
    app.use(favicon(path.join(__dirname, "favicon.ico")));
  }

  // If beforeParsers is defined, add all middleware to the app
  // before we define the parsers.  Useful for session, passport, etc.
  if (typeof options.beforeParsers === "function") {
    options.beforeParsers(app);
  }

  // Parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // Parse application/json
  app.use(express.json());

  // If beforeRouter is defined, add all middleware to the app
  // before we define the router. Useful for adding middleware just
  // before the router.
  if (typeof options.beforeRouter === "function") {
    options.beforeRouter(app);
  }

  // if protected is true, add protectWithJwt to the entire app
  if (options.protected) {
    app.use(protectWithJwt());
  }

  // Include our router with all endpoints added by the user
  app.use("/", router);

  // 404
  app.use(function (req, res, next) {
    next(createError(404, `${req.originalUrl} not found`));
  });

  // If we're using APM, add APM error collection
  // middleware before default error handler
  if (apm) {
    app.use(apm.middleware.connect());
  }

  // eslint-disable-next-line no-unused-vars
  function errorHandler(err, req, res, next) {
    logger.error({ err, req, res });

    res.status(err.status || 500);

    if (req.accepts("html")) {
      res.set("Content-Type", "text/html");
      res.send(`<h1>${err.status} Error</h1><p>${err.message}</p>`);
    } else if (req.accepts("json")) {
      res.json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.send(`${err.status} Error: ${err.message}\n`);
    }
  }
  app.use(errorHandler);

  return app;
}

class Satellite {
  constructor(options = {}) {
    // If we're given a healthCheck function, we'll use it with terminus below.
    // NOTE: this function should return a Promise.
    if (typeof options.healthCheck === "function") {
      this.healthCheck = options.healthCheck;
    }

    // Use the router passed to us
    this.router = options.router || createRouter();
    // Expose the app
    this.app = createApp(this.router, options);
  }

  start(port, callback) {
    if (this.server) {
      throw new Error("server already started");
    }

    if (typeof port !== "number") {
      throw new Error(`port number required, got ${port}`);
    }

    // Expose the server
    this.server = createServer(this.app);

    // Graceful shutdown and healthcheck
    createTerminus(this.server, {
      healthChecks: {
        "/healthcheck": this.healthCheck || (() => Promise.resolve()),
      },
      signal: "SIGINT",
      logger: logger.error,
    });

    // Start the server
    this.server.listen(port, callback);
  }

  stop(callback) {
    const self = this;

    function finished() {
      self.server = null;
      if (typeof callback === "function") {
        callback();
      }
    }

    if (!this.server) {
      finished();
      return;
    }

    this.server.close(finished);
  }
}

module.exports.Satellite = Satellite;
module.exports.logger = logger;
module.exports.Router = (options) => createRouter(options);
module.exports.ProtectedRouter = (options) => createRouter(options, true);
module.exports.protectWithJwt = protectWithJwt;
module.exports.hash = (input) => hash(input);
