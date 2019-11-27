const feedWorker = require('../src/backend/feed/feed-worker');

describe('testing the worker callback function', () => {
  const job1 = {
    data: { url: 'https://c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss' },
  };
  const job2 = { data: { url: 'c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss' } };
  const job3 = { data: { url: 'https://c3ho.blogspot.com/feeds/posts/default/-/open-source' } };
  const job4 = { data: { url: 'c3ho.blogspot.com/feeds/posts/default/-/open-source' } };
  const job5 = { data: { url: 'https://google.ca' } };
  const job6 = { data: { url: '128.190.222.135' } };
  const job7 = { data: { url: 'http://en.blog.wordpress.com/category/INVALID_CATEGORY/feed/' } };

  it('should pass with a valid ATOM feed URI', async () => {
    await expect(feedWorker.workerCallback(job1)).resolves.toBeTruthy();
  });

  it('should fail with an invalid ATOM feed URI should error', async () => {
    await expect(feedWorker.workerCallback(job2)).rejects.toThrow();
  });

  it('should pass with a valid RSS feed URI', async () => {
    await expect(feedWorker.workerCallback(job3)).resolves.toBeTruthy();
  });

  it('should fail with an invalid RSS feed URI', async () => {
    await expect(feedWorker.workerCallback(job4)).rejects.toThrow();
  });

  it('should fail with a valid URI, but not a feed URI', async () => {
    await expect(feedWorker.workerCallback(job5)).rejects.toThrow();
  });

  it('should fail by passing an IP address instead of a URI', async () => {
    await expect(feedWorker.workerCallback(job6)).rejects.toThrow();
  });

  it('should fail by passing an invalid RSS category feed due to empty array', async () => {
    await expect(feedWorker.workerCallback(job7)).rejects.toThrow();
  });
});
