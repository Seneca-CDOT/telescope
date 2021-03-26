const { Satellite } = require('@senecacdot/satellite');
const { router } = require('bull-board');

// May need in next revision
const parser = require('./routes/parser');

const service = new Satellite();

service.router.use('/', parser);
service.router.use('/queues', router);

module.exports = service;
