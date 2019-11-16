require('../config');
const Redis = require('ioredis');
const MockRedis = require('ioredis-mock');

// If you need to set the Redis URL, do it in REDIS_URL
const redisUrl = process.env.REDIS_URL;
// Set MOCK_REDIS=1 to mock, MOCK_REDIS= to use real redis
const useMockRedis = process.env.MOCK_REDIS;

// Export either a real Redis instance, or Mocked.
module.exports = useMockRedis ? new MockRedis(redisUrl) : new Redis(redisUrl);
