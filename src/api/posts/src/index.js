const { Satellite, Redis } = require('@senecacdot/satellite');

const posts = require('./routes/posts');

const service = new Satellite({
  healthCheck: async () => {
    const redis = Redis();

    const ok = await redis.ping();

    return { status: `Redis has responded with ${ok}` };
  },
});

service.router.use('/', posts);

module.exports = service;
