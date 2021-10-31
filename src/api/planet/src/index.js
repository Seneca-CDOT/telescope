const { static } = require('express');
const expressHandlebars = require('express-handlebars');
const { Satellite } = require('@senecacdot/satellite');
const path = require('path');
const planet = require('./planet');

const service = new Satellite({
  beforeRouter(app) {
    app.engine('handlebars', expressHandlebars());
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'handlebars');
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameSrc: ["'self'", '*.youtube.com', '*.vimeo.com'],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  },
});

// Legacy CDOT Planet static assets
service.router.use('/legacy', static(path.join(__dirname, '../static')));
service.router.use('/planet', planet);

module.exports = service;
