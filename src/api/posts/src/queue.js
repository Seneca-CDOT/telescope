const Bull = require('bull');
const redis = require('./redis');

const client = redis;
const subscriber = redis;

const queue = new Bull('feed-queue', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      default:
        return redis;
    }
  },
});

module.exports = queue;
