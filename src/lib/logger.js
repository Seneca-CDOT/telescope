const pino = require('pino');

require('../config');

let logger;

/* If in Development mode:
 * Output logs to console (which is by default)
 * Enable prettyPrint option and translate time from epoch time to local time.
 * Set log level to LOG_LEVEL environment variable with 'debug' as default level.
 */
if (process.env.NODE_ENV === 'development') {
  logger = pino({
    prettyPrint: { translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ' },
    level: process.env.LOG_LEVEL || 'debug',
  });
} else if (process.env.LOG_FILE) {
  /* If in Production mode:
   * Write logs to a specified path.
   * Set log level to LOG_LEVEL environment variable with 'info' as default level.
   */
  logger = pino({ level: process.env.LOG_LEVEL || 'info' }, pino.destination(process.env.LOG_FILE));
} else {
  logger = pino({ level: process.env.LOG_LEVEL || 'info' });
}

module.exports = logger;
