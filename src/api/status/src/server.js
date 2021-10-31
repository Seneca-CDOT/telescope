const { Satellite } = require('@senecacdot/satellite');
const serveStatic = require('serve-static');

const { check } = require('./services');

const satelliteOptions = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrcElem: ["'self'", 'https://kit.fontawesome.com'],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
        connectSrc: ["'self'", 'https://ka-f.fontawesome.com'],
        fontSrc: ["'self'", 'https://*'],
        imgSrc: ["'self'", 'data:*', 'https://*'],
      },
    },
  },
};

const service = new Satellite(satelliteOptions);

// Static web assets can be cached for a long time
service.router.use(serveStatic('public', { immutable: true, maxAge: '1y' }));

service.router.get('/status', (req, res) => {
  check()
    .then((status) => {
      // This status response shouldn't be cached (we need current status info)
      res.set('Cache-Control', 'no-store, max-age=0');
      return res.json(status);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
