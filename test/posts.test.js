const request = require('supertest');

const app = require('../src/backend/web/app');
const Post = require('../src/backend/data/post');
const Feed = require('../src/backend/data/feed');
const { addFeed, addPost } = require('../src/backend/utils/storage');
const hash = require('../src/backend/data/hash');

jest.mock('../src/backend/utils/indexer');

describe('test /posts endpoint', () => {
  const requestedItems = 50;
  const maxItems = 100;
  const createdItems = 150;
  const nonInteger = 'test';

  const posts = [...Array(createdItems).keys()].map((item) => {
    const guid = `http://telescope${item}.cdot.systems`;
    const id = hash(guid);
    return {
      id,
      guid,
      author: 'author',
      title: 'title',
      html: 'html',
      updated: new Date('2009-09-07T22:23:00.544Z'),
      published: new Date('2009-09-07T22:20:00.000Z'),
      url: 'foo',
      site: 'foo',
    };
  });

  beforeAll(() => Promise.all(posts.map((post) => addPost(post))));

  test('requests default number of items', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    // This will depend on the env value, so as long as we get back something.
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body instanceof Array).toBe(true);
  });

  test('requests a specific number of items', async () => {
    const res = await request(app).get('/posts?per_page=50');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(requestedItems);
    expect(res.body instanceof Array).toBe(true);
  });

  test('requests more items than the limit set by the server', async () => {
    const res = await request(app).get('/posts?per_page=150');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(maxItems);
    expect(res.body instanceof Array).toBe(true);
  });

  test('request posts with both query params', async () => {
    const res = await request(app).get('/posts?page=2&per_page=50');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(requestedItems);
    expect(res.body instanceof Array).toBe(true);
  });

  test('request posts with both only page param', async () => {
    const res = await request(app).get('/posts?page=3');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    // This will depend on the env value, so as long as we get back something.
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body instanceof Array).toBe(true);
  });

  test('request posts with non-integer page param', async () => {
    const res = await request(app).get(`/posts?page=${nonInteger}`);
    expect(res.status).toEqual(400);
  });
  test('request posts with non-integer per_page param', async () => {
    const res = await request(app).get(`/posts?per_page=${nonInteger}`);
    expect(res.status).toEqual(400);
  });
});

describe('test /posts/:id responses', () => {
  // an array of keys.
  const existingGuid = 'http://existing-guid';
  const missingGuid = 'http://missing-guid';
  const randomGuid = 'http://random-guid';

  const feed1 = new Feed(
    'Feed Author',
    'http://feed-url.com/',
    'user',
    'https://feed-link.com/',
    null,
    null
  );

  beforeAll(() => Promise.resolve(addFeed(feed1)));

  const addedPost1 = new Post(
    'Post Title',
    '<p>post text</p>',
    new Date('2009-09-07T22:20:00.000Z'),
    new Date('2009-09-07T22:23:00.000Z'),
    'url',
    randomGuid,
    feed1
  );

  beforeAll(() => Promise.resolve(addPost(addedPost1)));

  const receivedPost1 = new Post(
    'Post Title',
    '<p>post text</p>',
    new Date('2009-09-07T22:20:00.000Z'),
    new Date('2009-09-07T22:23:00.000Z'),
    'url',
    randomGuid,
    feed1
  );

  beforeAll(() => {
    feed1.save();
    addedPost1.save();
  });

  test("pass an id that doesn't exist", async () => {
    const res = await request(app).get(`/posts/${hash(missingGuid)}`);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(false);
  });

  test('pass an id that does exist', async () => {
    // Create a feed
    const feedId = await Feed.create({
      author: 'Feed Author',
      user: 'user',
      url: 'https://feed-url.com/',
    });
    const feed = await Feed.byId(feedId);

    // Create a post that uses this feed
    const postId = await Post.create({
      title: 'title',
      html: 'html',
      published: '2009-09-07T22:20:00.000Z',
      updated: '2009-09-07T22:23:00.000Z',
      url: 'https://feed-url.com/post',
      guid: existingGuid,
      feed,
    });
    const post = await Post.byId(postId);

    // Our post's id should be what we expect
    expect(postId).toEqual(hash(existingGuid));

    // Make sure we can get back this post/feed data via the REST api
    const res = await request(app).get(`/posts/${postId}`).set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(JSON.parse(JSON.stringify(post)));
  });

  test('requests text', async () => {
    const res = await request(app).get(`/posts/${addedPost1.id}`).set('Accept', 'text/plain');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('text/plain');
    expect(res.text).toEqual(receivedPost1.text);
  });

  test('requests HTML', async () => {
    const res = await request(app).get(`/posts/${addedPost1.id}`).set('Accept', 'text/html');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('text/html');
    expect(res.text).toEqual(receivedPost1.html);
  });

  test('requests JSON', async () => {
    const res = await request(app).get(`/posts/${addedPost1.id}`).set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(JSON.parse(JSON.stringify(receivedPost1)));
  });

  test('requests ID with 6 characters Test', async () => {
    const res = await request(app).get(`/posts/123456`).set('Accept', 'text/html');
    expect(res.status).toEqual(400);
  });

  test('requests ID with 14 characters Test', async () => {
    const res = await request(app).get(`/posts/12345678901234`).set('Accept', 'text/html');
    expect(res.status).toEqual(400);
  });

  test('requests ID with valid length but not exist Test', async () => {
    const res = await request(app).get(`/posts/1234567890`).set('Accept', 'text/html');
    expect(res.status).toEqual(404);
    expect(res.get('Content-length')).toEqual('46');
  });
});
