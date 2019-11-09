const pino = require('pino');
// eslint-disable-next-line no-unused-vars
const config = require('../src/config');

/* If in Production mode (assumed by default):
 * Define a new Logger instance.
 * Write logs to a specified path.
 * Set log level to LOG_LEVEL environment variable with 'info' as default level.
 */
let logger = pino({ level: process.env.LOG_LEVEL || 'info' }, pino.destination('./logFile'));

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
}

module.exports = logger;
