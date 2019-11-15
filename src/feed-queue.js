const Bull = require('bull');
const { setQueues } = require('bull-board');

require('./config');

const queue = new Bull('feed-queue', process.env.REDIS_URL);

// For visualizing queues using bull board
setQueues(queue);

module.exports = queue;
