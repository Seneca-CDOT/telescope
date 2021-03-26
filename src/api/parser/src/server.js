const { logger, fetch } = require('@senecacdot/satellite');
const service = require('.');

const port = parseInt(process.env.PARSER_PORT || 8888, 10);

// Start service
service.start(port);
