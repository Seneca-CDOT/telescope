const { Satellite } = require('@senecacdot/satellite');

const image = require('./routes/image');
const gallery = require('./routes/gallery');

const service = new Satellite();

service.router.use('/gallery', gallery);
service.router.use('/', image);

module.exports = service;
