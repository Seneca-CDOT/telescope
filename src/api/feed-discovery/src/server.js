const service = require('.');

const port = parseInt(process.env.FEED_DISCOVERY_PORT || 7777, 10);

service.start(port);
