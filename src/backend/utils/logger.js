/* eslint-disable no-lonely-if */
const pino = require('pino');
const expressPino = require('express-pino-logger');
const os = require('os');

require('../lib/config');

let logger;
let logLevel;

/* If in Development mode:
 * Output logs to console (which is by default)
 * Enable prettyPrint option and translate time from epoch time to local time.
 * Set log level to LOG_LEVEL environment variable with 'debug' as default level.
 */

/* Created a local variable to to hold the value form process.env.LOG_LEVEL.toLowerCase()
 * The if statement will check the variable if the variable is anything other than levels
 * stated within file it will automatically set to info.
 * https://getpino.io/#/docs/api?id=level-string Look for the title ``` level (String) ```
 */

logLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
if (!pino.levels.values[logLevel]) {
  logLevel = 'info';
}

if (logLevel !== 'info') {
  logLevel = 'info';
} else if (process.env.NODE_ENV === 'development') {
  logger = pino({
    prettyPrint: {
      translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
      colorize: !(os.type() === 'Windows_NT'),
    },
    level: process.env.LOG_LEVEL || 'debug',
  });
} else {
  if (process.env.LOG_FILE) {
    /* If in Production mode:
     * Write logs to a specified path.
     * Set log level to LOG_LEVEL environment variable with 'info' as default level.
     */
    logger = pino(
      {
        level: logLevel || 'info',
        prettyPrint: {
          translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
          colorize: false,
        },
      },
      pino.destination(process.env.LOG_FILE)
    );
  } else {
    logger = pino({
      level: logLevel || 'info',
      prettyPrint: {
        translateTime: 'SYS: yyyy-mm-dd HH:MM:ss.l ',
        colorize: false,
      },
    });
  }
}

const expressLogger = expressPino({ logger });

module.exports = expressLogger;
