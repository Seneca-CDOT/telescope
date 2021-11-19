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

// For local dev, allow specifying a different path prefix (i.e., to mimic Traefik routing with our <base> tag)

// Static web assets can be cached for a long time
service.router.use(process.env.PATH_PREFIX || '/', static(path.join(__dirname, '../public')));

if (process.env.PATH_PREFIX !== '/') {
  service.router.get('/', (req, res) => {
    res.redirect(process.env.PATH_PREFIX);
  });
}

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
