const feedQueue = require('../src/feed-queue');

/**
 * feedQueue.add() returns a promise which is usually true unless the Redis server is offline.
 * This test can be scrap in future builds, since it does not accomplish much
 *
 * NOTE: 'npm test' will most likely not end correctly with error:
 * 'Jest did not exit one second after the test run has completed. This usually
 * means that there are asynchronous operations that weren't stopped in your tests.
 * Consider running Jest with `--detectOpenHandles` to troubleshoot this issue'
 * CTRL + C to exit test.
 *
 * This is because the Redis server is still online, closing the server
 * after testing would fix the issue. Maybe we can handle opening and closing
 * Redis inside this project <- CREATE NEW ISSUE TO SOLVE THIS PROBLEM.
*/
test('Testing feed-queue.js', (done) => {
  feedQueue.add('http://ajhooper.blogspot.com/feeds/posts/default');
  done();
});
