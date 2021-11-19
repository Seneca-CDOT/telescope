const { Satellite } = require('@senecacdot/satellite');
const { static } = require('express');
const path = require('path');
const host = process.env.API_HOST || 'localhost';
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
          `${host.replace(/(^\w+:|^)\/\//, '')}:4000`,
          '*.github.com',
        ],
        fontSrc: ["'self'", 'data:', 'https:', '*.fontawesome.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
};

const service = new Satellite(satelliteOptions);

// If a PATH_PREFIX is defined, serve our static content there, and redirect / -> PATH_PREFIX.
// We do this in development to extra path routing that Traefik adds in production (e.g., /v1/status/*)
if (process.env.PATH_PREFIX) {
  service.router.use(process.env.PATH_PREFIX, static(path.join(__dirname, '../public')));
  service.router.get('/', (req, res) => {
    res.redirect(process.env.PATH_PREFIX);
  });
} else {
  service.router.use('/', static(path.join(__dirname, '../public')));
}

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
