// This needs to go first so it can instrument the app
// https://www.elastic.co/guide/en/apm/agent/nodejs/current/express.html
const apm = require("elastic-apm-node");

const { createServer } = require("http");
const { createTerminus } = require("@godaddy/terminus");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const createError = require("http-errors");
const pino = require("pino");
const ecsFormat = require("@elastic/ecs-pino-format");
const expressPino = require("express-pino-logger");

const logger = pino(ecsFormat({ convertReqRes: true }));

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

  // Parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // Parse application/json
  app.use(express.json());

  // Include our router with all endpoints added by the user
  app.use("/", router);

  // 404
  app.use(function (req, res, next) {
    next(createError(404));
  });

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
    if (!options.name) {
      throw new Error("service name required");
    }
    // Start APM monitoring if server URL is provided
    if (options.apmServerUrl) {
      apm.start({
        // Override service name from package.json
        // Allowed characters: a-z, A-Z, 0-9, -, _, and space
        serviceName: options.name,
        // Set custom APM Server URL (default: http://localhost:8200)
        serverUrl: options.apmServerUrl,
        // We can disable this in dev
        // active: process.env.NODE_ENV === 'production'
        centralConfig: false,
        // Don't bother instrumenting the healthcheck route
        ignoreUrls: ["/healthcheck"],
      });
    }

    // If we're given a healthCheck function, we'll use it with terminus below.
    // NOTE: this function should return a Promise.
    if (typeof options.healthCheck === "function") {
      this.healthCheck = options.healthCheck;
    }

    // Expose a router
    this.router = new express.Router();
    // Expose the app
    this.app = createApp(this.router, options);
  }

  start(port, callback) {
    if (this.server) {
      throw new Error("server already started");
    }

    if (typeof port !== "number") {
      throw new Error("port required");
    }

    // Expose the server
    this.server = createServer(this.app);

    // Graceful shutdown and healthcheck
    createTerminus(this.server, {
      healthChecks: {
        "/healthcheck": this.healthCheck || (() => Promise.resolve()),
      },
      signal: "SIGINT",
      logger,
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
module.exports.Router = express.Router;
