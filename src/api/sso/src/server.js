const service = require('.');

const port = parseInt(process.env.SSO_PORT || 7777, 10);
service.start(port);
