const { Satellite } = require('@senecacdot/satellite');
const { router } = require('bull-board');
// const startParserQueue = require('./parser-queue');

const service = new Satellite();

// We're commenting startParserQueue() for now so it doesn't clash with our current backend, will uncomment when tests go in and we remove the backend.
// startParserQueue();

service.router.use('/', router);

module.exports = service;
