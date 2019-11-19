const storage = require('../src/storage');

describe('Tests for storage', () => {
  const feed = { name: 'James Smith', url: 'http://seneca.co/jsmith' };
  const feed2 = { name: 'James Smith 2', url: 'http://seneca.co/jsmith/2' };

  it('inserting a feed returns a feed id', async () => {
    const feedId = await storage.addFeed(feed.name, feed.url);
    expect(typeof feedId).toBe('number');
  });

  it('should allow retrieving a feed by id after inserting', async () => {
    const feedId = await storage.addFeed(feed2.name, feed2.url);
    const result = await storage.getFeed(feedId);
    expect(result).toEqual(feed2);
  });
});
