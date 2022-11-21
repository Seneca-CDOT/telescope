const request = require('supertest');
const { hash } = require('@senecacdot/satellite');
const { app } = require('../src');
const { addPost, getPost, addFeed } = require('../src/storage');
const Feed = require('../src/data/feed');
const Post = require('../src/data/post');

describe('/posts', () => {
  const requestedItems = 50;
  const maxItems = 100;
  const createdItems = 150;
  const nonInteger = 'test';

  const feeds = [...Array(createdItems).keys()].map((item) => {
    const guid = `http://telescope${item}.cdot.systems`;
    const id = hash(guid);
    return {
      id,
      author: 'author',
      url: 'http://foo.url',
      user: 'user',
      link: `http://github.com/githubUsername`,
      etag: 'etag',
      lastModified: new Date('2009-09-07T22:23:00.544Z'),
      githubUsername: `githubUsername`,
    };
  });
  const posts = [...Array(createdItems).keys()].map((item, index) => {
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
      url: `http://localhost/v1/posts/${id}`,
      site: 'http://foo.site',
      feed: feeds[index].id,
    };
  });

  const expandedPosts = [...Array(createdItems).keys()].map((item) => {
    return {
      id: posts[item].id,
      url: posts[item].url,
      author: feeds[item].author,
      title: posts[item].title,
      publishDate: '2009-09-07T22:20:00.000Z',
    };
  });

  beforeAll(() => {
    posts.map((post) => addPost(post));
    feeds.map((feed) => addFeed(feed));
  });
  test('default number of items should be returned', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('requests a specific number of items', async () => {
    const res = await request(app).get('/?per_page=50');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(requestedItems);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('requests more items than the limit set by the server', async () => {
    const res = await request(app).get('/?per_page=150');

    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(maxItems);
  });

  test('request posts with both query params', async () => {
    const res = await request(app).get('/?page=2&per_page=50');
    expect(res.status).toEqual(200);
    expect(res.body.length).toBe(requestedItems);
  });

  test('request posts with both only page param', async () => {
    const res = await request(app).get('/?page=3');
    expect(res.status).toEqual(200);
    // This will depend on the env value, so as long as we get back something.
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('request posts with a valid expand(do not expand) query param', async () => {
    const res = await request(app).get('/?page=1&expand=0');
    expect(res.status).toEqual(200);
    // This will depend on the env value, so as long as we get back something.
    expect(res.body.length).toBeGreaterThan(0);
  });
  test('request posts with a valid expand query param', async () => {
    const res = await request(app).get('/?page=1&expand=1');
    expect(res.status).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((post) => {
      // check if the returned object is the same as the generated one in this test.
      expect(post).toEqual(
        // We need to find the corresponding post of res.body in expandedPosts by filtering it with its id.
        expect.objectContaining(expandedPosts.find((expandedPst) => expandedPst.id === post.id))
      );
    });
    expect(expandedPosts).toEqual(expect.arrayContaining(res.body));
  });
  test('request posts with an invalid expand query param', async () => {
    const res = await request(app).get('/?page=1&expand=abc');
    expect(res.status).toEqual(200);
    // This will depend on the env value, so as long as we get back something.
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('request posts with non-integer page param', async () => {
    const res = await request(app).get(`/?page=${nonInteger}`);
    expect(res.status).toEqual(400);
  });

  test('request posts with non-integer per_page param', async () => {
    const res = await request(app).get(`/?per_page=${nonInteger}`);
    expect(res.status).toEqual(400);
  });
});

describe('test /posts/:id responses', () => {
  const missingGuid = 'http://missing-guid';
  const youtubeGuid = 'http://youtube.com';
  const randomGuid = 'http://random-guid';

  const feed1 = new Feed(
    'Feed Author',
    'http://feed-url.com/',
    'user',
    'https://feed-link.com/',
    null,
    null
  );

  const youtubeFeed = new Feed(
    'YouTube Author',
    'http://youtube.com/feed/videos.xml',
    'user',
    'https://youtube.com/',
    null,
    null
  );

  beforeAll(() => Promise.all([addFeed(feed1), addFeed(youtubeFeed)]));

  const addedPost1 = new Post(
    'Post Title',
    '<p>post text</p>',
    new Date('2009-09-07T22:20:00.000Z'),
    new Date('2009-09-07T22:23:00.000Z'),
    'url',
    missingGuid,
    feed1
  );

  const addedVideo1 = new Post(
    'YouTube Video Title',
    'YouTube Video Description',
    new Date('2009-09-07T22:20:00.000Z'),
    new Date('2009-09-07T22:23:00.000Z'),
    'https://youtube.com/watch',
    youtubeGuid,
    youtubeFeed
  );

  beforeAll(() => Promise.all([addPost(addedPost1), addPost(addedVideo1)]));

  beforeAll(() => {
    feed1.save();
    youtubeFeed.save();
    addedPost1.save();
    addedVideo1.save();
  });

  test('A post with an id should be returned and match the id of a post from redis', async () => {
    const res = await request(app).get(`/${addedPost1.id}`);
    const post = await getPost(`${addedPost1.id}`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.id).toEqual(post.id);
  });

  test("Pass an id that doesn't exist", async () => {
    const res = await request(app).get(`/${hash(randomGuid)}`);
    expect(res.status).toEqual(404);
  });

  test('requests text', async () => {
    const res = await request(app).get(`/${addedPost1.id}`).set('Accept', 'text/plain');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('text/plain');
    expect(res.text).toEqual('post text');
  });

  test('requests JSON', async () => {
    const res = await request(app).get(`/${addedPost1.id}`).set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
  });

  test('requests HTML', async () => {
    const res = await request(app).get(`/${addedPost1.id}`).set('Accept', 'text/html');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('text/html');
    expect(res.text).toEqual('<p>post text</p>');
  });

  test('requests ID with 6 characters Test', async () => {
    const res = await request(app).get(`/123456`).set('Accept', 'text/html');
    expect(res.status).toEqual(400);
  });

  test('requests ID with 14 characters Test', async () => {
    const res = await request(app).get(`/12345678901234`).set('Accept', 'text/html');
    expect(res.status).toEqual(400);
  });

  test('requests ID with valid length but not exist Test', async () => {
    const res = await request(app).get(`/1234567890`).set('Accept', 'text/html');
    expect(res.status).toEqual(404);
    expect(res.get('Content-length')).toEqual('46');
  });

  test('request a post with type equal to "blogpost"', async () => {
    const res = await request(app).get(`/${addedPost1.id}`).set('Accept', 'application/json');
    const post = await getPost(`${addedPost1.id}`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.id).toEqual(post.id);
    expect(res.body.type).toEqual('blogpost');
  });

  test('request a post with type equal to "video"', async () => {
    const res = await request(app).get(`/${addedVideo1.id}`).set('Accept', 'application/json');
    const post = await getPost(`${addedVideo1.id}`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.id).toEqual(post.id);
    expect(res.body.type).toEqual('video');
  });
});
