const {
  addFeed,
  getFeed,
  getFeeds,
  getFlaggedFeeds,
  getFeedsCount,
  removeFeed,
  setFlaggedFeed,
  unsetFlaggedFeed,
  addPost,
  getPost,
  getPosts,
  getPostsCount,
  removePost,
} = require('../src/backend/utils/storage');

const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

describe('Storage tests for feeds', () => {
  const feed1 = new Feed('James Smith', 'http://seneca.co/jsmith', 'user');
  const feed2 = new Feed('James Smith 2', 'http://seneca.co/jsmith/2', 'user');
  const feed3 = new Feed('James Smith 2', 'http://seneca.co/jsmith/3', 'user', null, 'etag');
  const feed4 = new Feed(
    'James Smith 2',
    'http://seneca.co/jsmith/4',
    'user',
    'http://seneca.co/jsmith',
    'etag',
    'last-modified'
  );

  beforeAll(() => Promise.all([addFeed(feed1), addFeed(feed2), addFeed(feed3), addFeed(feed4)]));

  it('should allow retrieving a feed by id after inserting', async () => {
    const feed = await getFeed(feed1.id);
    expect(feed.id).toEqual(feed1.id);
    expect(feed.author).toEqual(feed1.author);
    expect(feed.url).toEqual(feed1.url);
    expect(feed.etag).toEqual('');
    expect(feed.lastModified).toEqual('');
    expect(feed.user).toEqual(feed1.user);
  });

  it('should return expected feed count', async () => {
    expect(await getFeedsCount()).toEqual(4);
  });

  it('should return expected feeds', async () => {
    expect(await getFeeds()).toEqual([feed1.id, feed2.id, feed3.id, feed4.id]);
  });

  it('should deal with etag property correctly when available and missing', async () => {
    const feeds = await Promise.all((await getFeeds()).map((id) => getFeed(id)));
    expect(feeds[0].etag).toBe('');
    expect(feeds[1].etag).toBe('');
    expect(feeds[2].etag).toBe('etag');
    expect(feeds[3].etag).toBe('etag');
  });

  it('should deal with lastModified property correctly when available and missing', async () => {
    const feeds = await Promise.all((await getFeeds()).map((id) => getFeed(id)));
    expect(feeds[0].lastModified).toBe('');
    expect(feeds[1].lastModified).toBe('');
    expect(feeds[2].lastModified).toBe('');
    expect(feeds[3].lastModified).toBe('last-modified');
  });

  it('feed4 should have a link value', async () => {
    const feeds = await Promise.all((await getFeeds()).map((id) => getFeed(id)));
    expect(feeds[0].link).toBe('');
    expect(feeds[1].link).toBe('');
    expect(feeds[2].link).toBe('');
    expect(feeds[3].link).toBe('http://seneca.co/jsmith');
  });

  it('feed4 should not exist after being removed', async () => {
    const feed = await getFeed(feed4.id);
    await removeFeed(feed.id);
    // Removing an already removed Feed should not error
    await removeFeed(feed.id);
    const removedFeed = await getFeed(feed.id);
    // This should return an empty Object {} (no id)
    const feeds = await getFeeds();
    expect(removedFeed.id).toBe(undefined);
    expect(feeds.includes(feed.id)).toBe(false);
  });

  it('feed3 should appear in flaggedFeed set after being flagged', async () => {
    const feed = await getFeed(feed3.id);
    await setFlaggedFeed(feed3.id);
    const feeds = await getFeeds();
    const flaggedFeeds = await getFlaggedFeeds();
    expect(flaggedFeeds.includes(feed.id)).toBe(true);
    expect(feeds.includes(feed.id)).toBe(false);
  });

  it('feed3 should not appear in flaggedFeed set after being unflagged', async () => {
    const feed = await getFeed(feed3.id);
    await unsetFlaggedFeed(feed3.id);
    const feeds = await getFeeds();
    const flaggedFeeds = await getFlaggedFeeds();
    expect(feeds.includes(feed.id)).toBe(true);
    expect(flaggedFeeds.includes(feed.id)).toBe(false);
  });
});

describe('Storage tests for posts', () => {
  const testPost = {
    guid: 'http://example.com',
    id: hash('http://example.com'),
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
    id: hash('http://dev.telescope.cdot.systems'),
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
    id: hash('http://telescope.cdot.systems'),
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

  beforeAll(() => Promise.all([testPost, testPost2, testPost3].map((post) => addPost(post))));

  it('should allow retrieving a post by id after inserting', async () => {
    const posts = await getPosts(0, 0);
    const result = await getPost(posts[0]);
    expect(result.id).toEqual(testPost3.id);
  });

  it('get all posts returns current number of posts', async () => {
    const result = await getPosts(0, 0);
    expect(result.length).toEqual(3);
  });

  it('get all posts returns sorted posts by date', async () => {
    const result = await getPosts(0, 0);
    const firstPost = await getPost(result[0]);
    const secondPost = await getPost(result[1]);
    expect(firstPost.id).toEqual(testPost3.id);
    expect(secondPost.id).toEqual(testPost2.id);
  });

  it('check post count', async () => {
    const count = await getPostsCount();
    expect(count).toEqual(3);
  });

  it('testPost and testPost2 should not appear in results after being removed', async () => {
    const initPostCount = getPostsCount();
    await Promise.all([removePost(testPost.id), removePost(testPost2.id)]);
    const postCount = getPostsCount();
    const posts = await getPosts(0, 0);
    // Counts should not be the same after removing two posts
    expect(postCount).not.toBe(initPostCount);
    // id of testPost1 + testPost2 should not be in the array of postId returned by getPosts()
    expect(posts.includes(testPost.id)).toBe(false);
    expect(posts.includes(testPost2.id)).toBe(false);
    // Checking to make sure testPost3 id is in there just to make sure
    expect(posts.includes(testPost3.id)).toBe(true);
  });
});
