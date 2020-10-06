const feedQueue = require('../src/backend/feed/queue');

// Bull will hold the redis connection open unless we shutdown the queue,
// which will block jest from completing.  After all tests are done, close it.
afterAll(() => feedQueue.close());

/**
 * feedQueue.add() returns a promise which is usually true unless the Redis server is offline.
 */
test('able to add a job to the feed queue', () =>
  feedQueue.add('http://ajhooper.blogspot.com/feeds/posts/default'));
