const { Satellite } = require('@senecacdot/satellite');

const image = require('./routes/image');
const gallery = require('./routes/gallery');

const options = {
  helmet: {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  },
};

const service = new Satellite(options);

service.router.use('/gallery', gallery);
service.router.use('/', image);

module.exports = service;
