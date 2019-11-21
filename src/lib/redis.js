require('../config');
const Redis = require('ioredis');
const MockRedis = require('ioredis-mock');

const logger = require('./logger');

// If you need to set the Redis URL, do it in REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Set MOCK_REDIS=1 to mock, MOCK_REDIS= to use real redis
const useMockRedis = process.env.MOCK_REDIS;

// RedisConstructor is one of Redis or MockRedis
const RedisConstructor = useMockRedis ? MockRedis : Redis;

// Export either a real Redis instance, or Mocked.
const redisInstance = new RedisConstructor(redisUrl);

// If using MockRedis, shim info() until https://github.com/stipsan/ioredis-mock/issues/841 ships
if (useMockRedis && typeof MockRedis.prototype.info !== 'function') {
  logger.debug('Shimming MockRedis info() method');
  MockRedis.prototype.info = () => Promise.resolve('redis_version:999.999.999');
}

module.exports = {
  // Redis URL to use if using the constructor
  redisUrl,
  // If callers need to create a new redis instance, they'll use the ctor
  Redis: RedisConstructor,
  // Otherwise they can use this shared instance (most should use this)
  redis: redisInstance,
};
