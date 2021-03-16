const service = require('.');

const port = parseInt(process.env.FEED_DISCOVERY_PORT || 9999, 10);

service.start(port);
