const service = require('.');

const port = parseInt(process.env.PLANET_PORT || 9876, 10);

service.start(port);
