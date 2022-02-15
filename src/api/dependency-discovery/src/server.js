const service = require('.');

const port = parseInt(process.env.DEPENDENCY_DISCOVERY_PORT || 10500, 10);

service.start(port);
