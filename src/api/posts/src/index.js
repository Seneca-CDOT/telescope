const { Satellite, Redis } = require('@senecacdot/satellite');

const posts = require('./routes/posts');

const redis = Redis();

const service = new Satellite({
  healthCheck: async () => {
    const ok = await redis.ping();

    return { status: `Redis has responded with ${ok}` };
  },
});

service.router.use('/', posts);

module.exports = service;

module.exports.redis = redis;
