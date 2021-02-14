const { Satellite } = require('@senecacdot/satellite');

const query = require('./src/routes/query');

const service = new Satellite();
service.router.use('/query', query);

const port = parseInt(process.env.SEARCH_PORT || 4445, 10);
service.start(port);
