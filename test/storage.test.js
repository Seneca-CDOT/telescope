const {
  addFeed,
  getFeed,
  getFeeds,
  getFeedsCount,
  addPost,
  getPost,
  getPosts,
  getPostsCount,
} = require('../src/backend/utils/storage');

describe('Storage tests for feeds', () => {
  const feed = { name: 'James Smith', url: 'http://seneca.co/jsmith' };
  const feed2 = { name: 'James Smith 2', url: 'http://seneca.co/jsmith/2' };

  it('inserting a feed returns a feed id', async () => {
    const feedId = await addFeed(feed.name, feed.url);
    expect(typeof feedId).toBe('string');
  });

  it('should allow retrieving a feed by id after inserting', async () => {
    const feedId = await addFeed(feed2.name, feed2.url);
    const result = await getFeed(feedId);
    expect(result).toEqual(feed2);
  });

  it('check feed count', async () => {
    await addFeed(feed.name, feed.url);
    await addFeed(feed2.name, feed2.url);
    expect(await getFeedsCount()).toEqual(2);
  });

  it('should return ids of all the feeds', async () => {
    const feedId1 = await addFeed(feed.name, feed.url);
    const feedId2 = await addFeed(feed2.name, feed2.url);
    const result = await getFeeds();
    expect(result).toContain(feedId1.toString());
    expect(result).toContain(feedId2.toString());
  });
});

describe('Storage tests for posts', () => {
  const testPost = {
    guid: 'http://example.com',
    author: 'foo',
    title: 'foo',
    link: 'foo',
    content: 'foo',
    text: 'foo',
    updated: new Date('2009-09-07T22:23:00.544Z'),
    published: new Date('2009-09-07T22:20:00.000Z'),
    url: 'foo',
    site: 'foo',
  };

  const testPost2 = {
    guid: 'http://dev.telescope.cdot.systems',
    author: 'foo',
    title: 'foo',
    link: 'foo',
    content: 'foo',
    text: 'foo',
    updated: new Date('2009-09-07T22:23:00.544Z'),
    published: new Date('2009-09-07T22:21:00.000Z'),
    url: 'foo',
    site: 'foo',
  };

  const testPost3 = {
    guid: 'http://telescope.cdot.systems',
    author: 'foo',
    title: 'foo',
    link: 'foo',
    content: 'foo',
    text: 'foo',
    updated: new Date('2009-09-07T22:23:00.544Z'),
    published: new Date('2009-09-07T22:22:00.000Z'),
    url: 'foo',
    site: 'foo',
  };

  beforeAll(() => Promise.all([testPost, testPost2, testPost3].map(post => addPost(post))));

  it('should allow retrieving a post by guid after inserting', async () => {
    const result = await getPost(testPost.guid);
    expect(result.guid).toEqual(testPost.guid);
  });

  it('get all posts returns current number of posts', async () => {
    const result = await getPosts(0, 0);
    expect(result.length).toEqual(3);
  });

  it('get all posts returns sorted posts by date', async () => {
    const result = await getPosts(0, 0);
    expect(result[0]).toEqual(testPost3.guid);
    expect(result[1]).toEqual(testPost2.guid);
  });

  it('check post count', async () => {
    const count = await getPostsCount();
    expect(count).toEqual(3);
  });
});
