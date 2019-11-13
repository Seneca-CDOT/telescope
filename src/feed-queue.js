const Bull = require('bull');
require('./config');

const queue = new Bull('feed-queue', process.env.REDIS_URL);

module.exports = queue;
