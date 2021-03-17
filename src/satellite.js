const { createServer } = require('http');
const { createTerminus } = require('@godaddy/terminus');

const { createApp, createRouter } = require('./app');
const logger = require('./logger');

class Satellite {
  constructor(options = {}) {
    // If we're given a healthCheck function, we'll use it with terminus below.
    // NOTE: this function should return a Promise.
    if (typeof options.healthCheck === 'function') {
      this.healthCheck = options.healthCheck;
    }

    // Use the router passed to us
    this.router = options.router || createRouter();
    // Expose the app
    this.app = createApp(this.router, options);
  }

  start(port, callback) {
    if (this.server) {
      throw new Error('server already started');
    }

    if (typeof port !== 'number') {
      throw new Error(`port number required, got ${port}`);
    }

    // Expose the server
    this.server = createServer(this.app);

    // Graceful shutdown and healthcheck
    createTerminus(this.server, {
      healthChecks: {
        '/healthcheck': this.healthCheck || (() => Promise.resolve()),
      },
      signal: 'SIGINT',
      logger: (...args) => logger.error(...args),
    });

    // Start the server
    this.server.listen(port, callback);
  }

  stop(callback) {
    const self = this;

    function finished() {
      self.server = null;
      if (typeof callback === 'function') {
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

module.exports = Satellite;
