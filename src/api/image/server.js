const { Satellite } = require('@senecacdot/satellite');

const image = require('./src/routes/image');
const gallery = require('./src/routes/gallery');
const { download } = require('./src/lib/photos');

const service = new Satellite();

service.router.use('/image', image);
service.router.use('/gallery', gallery);

const port = parseInt(process.env.IMAGE_PORT || 4444, 10);
// Once the server is running, start downloading any missing Unsplash photos
service.start(port, download);
