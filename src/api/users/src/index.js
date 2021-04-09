const { Satellite } = require('@senecacdot/satellite');

const service = new Satellite();
const users = require('./routes/users');

service.router.use('/', users);

module.exports = service;
