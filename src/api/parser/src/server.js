const service = require('.');

const port = parseInt(process.env.PARSER_PORT || 10000, 10);

// Start service
service.start(port);
