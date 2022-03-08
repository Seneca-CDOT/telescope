const logger = require('./logger');
const Redis = require('ioredis');
const MockRedis = require('ioredis-mock');

// If you need to set the Redis URL, do it in REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

// Set MOCK_REDIS=1 to mock, MOCK_REDIS= to use real redis
const useMockRedis = process.env.MOCK_REDIS;

// RedisConstructor is one of Redis or MockRedis
const RedisConstructor = useMockRedis ? MockRedis : Redis;

// Keep track of all clients we create, so we can close them on shutdown
const clients = [];

function createRedisClient(options) {
  const client = new RedisConstructor(redisUrl, options);
  clients.push(client);
  return client;
}

// If using MockRedis, shim info() until https://github.com/stipsan/ioredis-mock/issues/841 ships
if (useMockRedis && typeof MockRedis.prototype.info !== 'function') {
  logger.debug('Shimming MockRedis info() method');
  MockRedis.prototype.info = () => Promise.resolve('redis_version:999.999.999');
}

module.exports.Redis = createRedisClient;

// Quit all connections gracefully
module.exports.shutDown = () =>
  Promise.all(
    clients.map(async (client) => {
      try {
        await client.quit();
      } catch (err) {
        logger.debug({ err }, 'unable to close redis connection');
      }
    })
  );
