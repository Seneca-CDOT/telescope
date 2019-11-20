const Bull = require('bull');
const { Redis, redisUrl } = require('./redis');

require('../config');

// https://github.com/OptimalBits/bull/blob/28a2b9aa444d028fc5192c9bbdc9bb5811e77b08/PATTERNS.md#reusing-redis-connections
const client = new Redis(redisUrl);
const subscriber = new Redis(redisUrl);

/**
 * Pass a name and get back a Bull Queue using that name.
 * We manage the creation of the redis connections.
 */
function createQueue(name) {
  return new Bull(name, {
    createClient: type => {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return new Redis(redisUrl);
      }
    },
  });
}

module.exports = {
  createQueue,
};
