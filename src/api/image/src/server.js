const service = require('.');
const { download } = require('./lib/photos');

const port = parseInt(process.env.IMAGE_PORT || 4444, 10);

// Once the server is running, start downloading any missing Unsplash photos
service.start(port, download);
