const { Satellite } = require('@senecacdot/satellite');
const serveStatic = require('serve-static');

const { check } = require('./services');

const service = new Satellite();

service.router.use(serveStatic('public'));

service.router.get('/status', (req, res) => {
  check()
    .then((status) => res.json(status))
    .catch((err) => res.status(500).json({ error: err.message }));
});

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
