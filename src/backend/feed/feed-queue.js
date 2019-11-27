const { setQueues } = require('bull-board');

require('../lib/config');
const { createQueue } = require('../lib/queue');

// Create a Bull Redis Queue
const queue = createQueue('feed-queue');

// For visualizing queues using bull board
setQueues(queue);

module.exports = queue;
