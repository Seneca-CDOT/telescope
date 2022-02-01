const { Satellite } = require('@senecacdot/satellite');

const dependenciesRoute = require('./router');

const service = new Satellite();

service.router.use('/', dependenciesRoute);

module.exports = service;
