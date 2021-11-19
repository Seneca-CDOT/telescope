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
        connectSrc: [
          "'self'",
          '*.fontawesome.com',
          `${process.env.API_HOST.replace(/(^\w+:|^)\/\//, '')}:4000`,
          '*.github.com',
        ],
        fontSrc: ["'self'", 'data:', 'https:', '*.fontawesome.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
};

const service = new Satellite(satelliteOptions);

// For local dev, allow specifying a different path prefix (i.e., to mimic Traefik routing with our <base> tag)
const staticPathPrefix = process.env.PATH_PREFIX || '/';
service.router.use(staticPathPrefix, static(path.join(__dirname, '../public')));

// Static web assets can be cached for a long time
service.router.use('/', static(path.join(__dirname, '../public')));

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
