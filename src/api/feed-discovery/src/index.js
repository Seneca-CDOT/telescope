const { Satellite } = require('@senecacdot/satellite');

const feedDiscoverRouter = require('./router');

const service = new Satellite();

service.router.use('/', feedDiscoverRouter);

module.exports = service;
