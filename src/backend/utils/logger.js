const {
  ELASTIC_URL,
  ELASTIC_PORT,
  INDEX_NAME,
  ELASTIC_VERSION,
  FLUSH_BYTES,
  CONSISTENCY,
  LOG_ELASTIC,
  LOG_LEVEL,
  NODE_ENV,
} = process.env;
const pino = require('pino');
const pinoElastic = require('pino-elasticsearch');
const expressPino = require('express-pino-logger');
const os = require('os');
const path = require('path');
const parseUrl = require('./url-parser');

require('../lib/config');

// Deal with log levels we don't know, or which are incorrectly formatted
let logLevel = (LOG_LEVEL || 'info').toLowerCase();
if (!pino.levels.values[logLevel]) {
  // Use `debug` by default in development mode, `info` otherwise.
  logLevel = NODE_ENV === 'development' ? 'debug' : 'info';
}

const options = {
  prettyPrint: {
    // Translate time from epoch time to local time
    translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
  },
  level: logLevel,
};

// Log to stdout, or a file if LOG_FILE is specified
let destination;
if (process.env.LOG_FILE) {
  destination = pino.destination(path.resolve(process.cwd(), process.env.LOG_FILE));
  options.prettyPrint = false;
  //  options.prettyPrint.colorize = false;
} else {
  // Try to use colour when not logging to a file, but skip on Windows
  options.prettyPrint.colorize = !(os.type() === 'Windows_NT');
  destination = pino.destination(process.stdout.fd);
}

const streamToElastic = pinoElastic({
  // Name of the index the logs will be stored under
  index: (INDEX_NAME || 'logs').toLowerCase(),
  // Consistency of the write, valid values: 'one', 'quorum', 'all'
  consistency: (CONSISTENCY || 'one').toLowerCase(),
  // URL of Elasticsearch
  node: parseUrl(ELASTIC_URL, ELASTIC_PORT),
  // Elasticsearch version
  'es-version': ELASTIC_VERSION || 7,
  // The number of bytes for each bulk insert
  'flush-bytes': FLUSH_BYTES || 1000,
});

const logger = pino(options, LOG_ELASTIC ? streamToElastic : destination);

const expressLogger = expressPino({ logger });

module.exports = expressLogger;
