const pino = require('pino');

// Pretty debug logging
let logger = pino({
  prettyPrint: {},
  prettifier: require('pino-colada'),
});

module.exports = logger;
