const pino = require('pino');

const pinoOptions = { level: process.env.LOG_LEVEL || 'info' };

// Pretty debug logging
if (pinoOptions.level === 'debug') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

module.exports = pino(pinoOptions);
