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

const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

describe('Storage tests for feeds', () => {
  const feed1 = new Feed('James Smith', 'http://seneca.co/jsmith');
  const feed2 = new Feed('James Smith 2', 'http://seneca.co/jsmith/2');

  beforeAll(() => Promise.all([addFeed(feed1), addFeed(feed2)]));

  it('should allow retrieving a feed by id after inserting', async () => {
    const result = await getFeed(feed1.id);
    expect(result).toEqual(feed1);
  });

  it('should return expected feed count', async () => {
    expect(await getFeedsCount()).toEqual(2);
  });

  it('should return expected feeds', async () => {
    expect(await getFeeds()).toEqual([feed1.id, feed2.id]);
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
