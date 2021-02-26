const { Satellite } = require('@senecacdot/satellite');
const posts = require('./src/routes/posts');

const service = new Satellite();

service.router.use('/posts', posts);

const port = parseInt(process.env.POSTS_PORT || 5555, 10);

service.start(port);
