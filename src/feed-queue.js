const Bull = require('bull');
const queue = new Bull('feed-queue');

module.exports = queue;

