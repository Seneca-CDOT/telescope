const service = require('.');

const port = parseInt(process.env.POSTS_PORT || 5555, 10);

service.start(port);
