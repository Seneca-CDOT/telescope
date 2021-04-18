const { Satellite } = require('@senecacdot/satellite');

const query = require('./routes/query');

const service = new Satellite();

service.router.use('/', query);

module.exports = service;
