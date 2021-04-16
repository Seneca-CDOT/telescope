const { Satellite, Redis } = require('@senecacdot/satellite');

const posts = require('./routes/posts');

const redis = Redis();

const service = new Satellite({
  healthCheck: () => {
    redis.ping();
  },
});

service.router.use('/', posts);

module.exports = service;

module.exports.redis = redis;
