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

  it('should return feed id after inserting', async () => {
    const feedId = await storage.addFeed(feed.name, feed.url);
    const result = await storage.getFeeds();
    expect(result.indexOf(feedId.toString()) > -1).toEqual(true);
  });

  it('should increment feedId', async () => {
    const feedId1 = await storage.addFeed(feed.name, feed.url);
    const feedId2 = await storage.addFeed(feed2.name, feed2.url);
    expect(feedId2 - feedId1).toEqual(1);
  });
});
