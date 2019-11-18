const pino = require('pino');
const expressPino = require('express-pino-logger');
const os = require('os');

require('../config');

let logger;

/* If in Development mode:
 * Output logs to console (which is by default)
 * Enable prettyPrint option and translate time from epoch time to local time.
 * Set log level to LOG_LEVEL environment variable with 'debug' as default level.
 */
if (process.env.NODE_ENV === 'development') {
  logger = pino({
    prettyPrint: {
      translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
      colorize: !(os.type() === 'Windows_NT'),
    },
    level: process.env.LOG_LEVEL || 'debug',
  });
} else if (process.env.LOG_FILE) {
  /* If in Production mode:
   * Write logs to a specified path.
   * Set log level to LOG_LEVEL environment variable with 'info' as default level.
   */
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: {
      translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
      colorize: false,
    },
  }, pino.destination(process.env.LOG_FILE));
} else {
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: {
      translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
      colorize: false,
    },
  });
}

const expressLogger = expressPino({ logger });

module.exports = expressLogger;
