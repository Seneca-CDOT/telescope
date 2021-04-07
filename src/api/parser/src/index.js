const { Satellite } = require('@senecacdot/satellite');
const { router } = require('bull-board');
const startParserQueue = require('./parser-queue');

const service = new Satellite();

startParserQueue();

service.router.use('/', router);

module.exports = service;
