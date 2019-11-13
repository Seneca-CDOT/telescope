const config = require('./config');
const Bull = require('bull');

const redisUrl = process.env.REDIS_URL;
const queue = new Bull('feed-queue', redisUrl);

module.exports = queue;
