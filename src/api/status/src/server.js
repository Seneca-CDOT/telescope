const { Satellite } = require('@senecacdot/satellite');
const { static } = require('express');
const path = require('path');

const satelliteOptions = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", '*.fontawesome.com', 'cdn.jsdelivr.net'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          '*.fontawesome.com',
          'fonts.googleapis.com',
          'cdn.jsdelivr.net',
        ],
        connectSrc: ["'self'", '*.fontawesome.com'],
        fontSrc: ["'self'", 'data:', 'https:', '*.fontawesome.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
};

const service = new Satellite(satelliteOptions);

// Static web assets can be cached for a long time
service.router.use('/', static(path.join(__dirname, '../public')));

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
