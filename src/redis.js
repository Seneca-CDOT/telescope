const logger = require('./logger');
const Redis = require('ioredis');
const MockRedis = require('ioredis-mock');

// If you need to set the Redis URL, do it in REDIS_URL
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

// Set MOCK_REDIS=1 to mock, MOCK_REDIS= to use real redis
const useMockRedis = process.env.MOCK_REDIS;

// RedisConstructor is one of Redis or MockRedis
const redisConstructor = useMockRedis ? MockRedis : Redis;

function createRedisClient() {
  try {
    const { port, host } = new URL(redisUrl);
    return new redisConstructor(port, host, {
      password: process.env.REDIS_PASSWORD,
    });
  } catch (error) {
    const message = `Unable to parse port and host from "${redisUrl}"`;
    logger.error({ error }, message);
    throw new Error(message);
    //createError(error, message); Future Proofing when createError is merged.
  }
}

// If using MockRedis, shim info() until https://github.com/stipsan/ioredis-mock/issues/841 ships
if (useMockRedis && typeof MockRedis.prototype.info !== 'function') {
  logger.debug('Shimming MockRedis info() method');
  MockRedis.prototype.info = () => Promise.resolve('redis_version:999.999.999');
}

module.exports = createRedisClient;
