const { Satellite } = require('@senecacdot/satellite');
const { redis } = require('./redis');

const posts = require('./routes/posts');

const service = new Satellite({
  healthCheck: () => redis.ping(),
});

service.router.use('/', posts);

module.exports = service;
