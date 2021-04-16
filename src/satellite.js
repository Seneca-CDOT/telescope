const { createTerminus } = require('@godaddy/terminus');

const { createApp, createRouter } = require('./app');
const logger = require('./logger');

function createServer(app, credentials) {
  // If we're given key/cert credentials, use HTTPS, otherwise HTTP
  if (credentials) {
    return require('https').createServer(credentials, app);
  }
  return require('http').createServer(app);
}

class Satellite {
  constructor(options = {}) {
    // If we're given a healthCheck function, we'll use it with terminus below.
    // NOTE: this function should return a Promise.
    this.healthCheck =
      typeof options.healthCheck === 'function' ? options.healthCheck : () => Promise.resolve();

    // If we're given a shutDown function, we'll use it with terminus below.
    // NOTE: this function should return a Promise.
    this.shutDown =
      typeof options.shutDown === 'function' ? options.shutDown : () => Promise.resolve();

    // Keep track of credentials if we're passed any
    this.credentials = options.credentials;
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
    this.server = createServer(this.app, this.credentials);

    // Graceful shutdown and healthcheck
    createTerminus(this.server, {
      healthChecks: {
        '/healthcheck': this.healthCheck,
      },
      signal: 'SIGINT',
      onSignal() {
        // Do any async cleanup required to gracefully shutdown
        return this.shutDown();
      },
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
