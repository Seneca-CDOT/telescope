const service = require('.');

const port = parseInt(process.env.SEARCH_PORT || 4445, 10);

service.start(port);
