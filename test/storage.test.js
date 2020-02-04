const {
  addFeed,
  getFeed,
  getFeeds,
  getFeedsCount,
  addPost,
  getPost,
  getPosts,
  getPostsCount,
  setInvalidFeed,
  isInvalid,
} = require('../src/backend/utils/storage');

const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

describe('Storage tests for feeds', () => {
  const feed1 = new Feed('James Smith', 'http://seneca.co/jsmith');
  const feed2 = new Feed('James Smith 2', 'http://seneca.co/jsmith/2');
  const feed3 = new Feed('James Smith 2', 'http://seneca.co/jsmith/3', 'etag');
  const feed4 = new Feed('James Smith 2', 'http://seneca.co/jsmith/4', 'etag', 'last-modified');
  const feed5 = new Feed(
    'James Smith Invalid Feed',
    'http://seneca.co/jsmith/4',
    'etag',
    'last-modified'
  );

  beforeAll(() =>
    Promise.all([
      addFeed(feed1),
      addFeed(feed2),
      addFeed(feed3),
      addFeed(feed4),
      setInvalidFeed(feed5.id, 'This just fails'),
    ])
  );

  it('should allow retrieving a feed by id after inserting', async () => {
    const feed = await getFeed(feed1.id);
    expect(feed.id).toEqual(feed1.id);
    expect(feed.author).toEqual(feed1.author);
    expect(feed.url).toEqual(feed1.url);
    expect(feed.etag).toEqual('');
    expect(feed.lastModified).toEqual('');
  });

  it('should return expected feed count', async () => {
    expect(await getFeedsCount()).toEqual(4);
  });

  it('should return expected feeds', async () => {
    expect(await getFeeds()).toEqual([feed1.id, feed2.id, feed3.id, feed4.id]);
  });

  it('should deal with etag property correctly when available and missing', async () => {
    const feeds = await Promise.all((await getFeeds()).map(id => getFeed(id)));
    expect(feeds[0].etag).toBe('');
    expect(feeds[1].etag).toBe('');
    expect(feeds[2].etag).toBe('etag');
    expect(feeds[3].etag).toBe('etag');
  });

  it('should deal with lastModified property correctly when available and missing', async () => {
    const feeds = await Promise.all((await getFeeds()).map(id => getFeed(id)));
    expect(feeds[0].lastModified).toBe('');
    expect(feeds[1].lastModified).toBe('');
    expect(feeds[2].lastModified).toBe('');
    expect(feeds[3].lastModified).toBe('last-modified');
  });

  it('feed4 should be a valid feed', async () => {
    expect(await isInvalid(feed4.id)).toBe(0);
  });

  it('feed5 should be an invalid feed', async () => {
    expect(await isInvalid(feed5.id)).toBe(1);
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

  beforeAll(() => Promise.all([testPost, testPost2, testPost3].map(post => addPost(post))));

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
});
