const service = require('.');

const port = parseInt(process.env.AUTH_PORT || 7777, 10);
service.start(port);
