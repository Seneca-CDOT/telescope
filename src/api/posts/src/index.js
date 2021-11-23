const { Satellite } = require('@senecacdot/satellite');
const redis = require('./redis');

const posts = require('./routes/posts');
const feeds = require('./routes/feeds');

const service = new Satellite({
  cors: { exposedHeaders: ['X-Total-Count', 'Link'] },
  healthCheck: () => redis.ping(),
});

service.router.use('/feeds', feeds);
service.router.use('/', posts);

module.exports = service;
