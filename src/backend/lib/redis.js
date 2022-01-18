const { Redis } = require('@senecacdot/satellite');

module.exports = {
  // If callers need to create a new redis instance, they'll use the ctor
  createRedisClient: Redis,
  // Otherwise they can use this shared instance (most should use this)
  redis: Redis(),
};
