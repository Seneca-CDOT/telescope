const request = require('supertest');

const app = require('../src/backend/web/app');
const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

jest.mock('../src/backend/utils/elastic');

// Mock the internal authentication strategy
jest.mock('../src/backend/web/authentication');
// Use our authentication test helper
const { login, logout } = require('./lib/authentication');

describe('test GET /feeds endpoint', () => {
  const createdItems = 150;

  // Array of feeds
  const feeds = [...Array(createdItems).keys()].map((item) => {
    return new Feed('foo', `http://telescope${item}.cdot.systems`);
  });

  beforeAll(() => Promise.all(feeds.map((feed) => feed.save())));

  it('requests feeds', async () => {
    const res = await request(app).get('/feeds');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(createdItems);
    expect(res.body instanceof Array).toBe(true);
  });
});

describe('test /feeds/:id responses', () => {
  const existingUrl = 'http://existing-url';
  const existingLink = 'http://existing-link';
  const missingUrl = 'http://missing-url';

  // an object to be added for testing purposes
  const addedFeed = new Feed('foo', existingUrl, 'user', existingLink);

  // an object, expected to be returned by a correct query
  const receivedFeed = {
    author: 'foo',
    url: existingUrl,
    user: 'user',
    link: existingLink,
    id: hash(existingUrl),
    etag: null,
    lastModified: null,
  };

  // add the feed to the storage
  beforeAll(() => addedFeed.save());

  // tests
  it("pass an id that doesn't exist", async () => {
    const res = await request(app).get(`/feeds/${hash(missingUrl)}`);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(false);
  });

  it('pass an id that does exist', async () => {
    const res = await request(app).get(`/feeds/${hash(existingUrl)}`);

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(receivedFeed);
    expect(res.body instanceof Array).toBe(false);
  });
});

describe('test POST /feeds endpoint', () => {
  beforeEach(() => login());

  it('fails if not logged in', async () => {
    const feedData = {
      author: 'foo',
      url: 'http://telescope200.cdot.systems',
      user: 'user',
    };
    logout();
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('responds with json', async () => {
    const feedData = {
      author: 'foo',
      url: 'http://telescope200.cdot.systems',
      user: 'user',
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    const { id } = res.body;
    const feed = await Feed.byId(id);
    expect(feed.author).toEqual(feedData.author);
    expect(feed.url).toEqual(feedData.url);
  });

  it('no author being sent', async () => {
    const feedData = {
      author: null,
      user: 'user',
      url: 'http://telescope200.cdot.systems',
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('no url being sent', async () => {
    const feedData = {
      author: 'foo',
      user: 'user',
      url: null,
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('url already in the feed list', async () => {
    const feedData = {
      author: 'foo',
      url: 'http://telescope0.cdot.systems',
      user: 'user',
    };
    await Feed.create(feedData);
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(409);
  });
});

describe.skip('test DELETE /feeds/:id endpoint', () => {
  let feedId;

  beforeEach(async () => {
    logout();
    const user = login('Johannes Kepler', 'user1@example.com');

    const feedData = {
      author: user.name,
      url: 'http://telescope200.cdot.systems',
      user: user.id,
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    feedId = res.body.id;
  });

  afterAll(() => logout());

  it('should respond with a 403 status when not logged in', async () => {
    logout();
    const res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 403 status when targeted feed is not owned by user', async () => {
    logout();
    login('Galileo Galilei', 'user2@example.com');
    const res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 204 status when targeted feed is owned by user', async () => {
    let res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(204);

    res = await request(app).get(`/feeds/${feedId}`);
    expect(res.status).toEqual(404);
  });
});

describe.skip('test GET /user/feeds endpoint', () => {
  let user;

  beforeAll(() => {
    user = login('Johannes Kepler', 'user1@example.com');
  });

  beforeEach(() => {
    logout();
    login('Johannes Kepler', 'user1@example.com');
  });

  afterAll(() => logout());

  it('should respond with a 403 status when not logged in', async () => {
    logout();
    const res = await request(app).get(`/user/feeds`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 200 status and JSON array if logged in', async () => {
    const res = await request(app).get(`/user/feeds`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(true);
  });

  it('should respond with an updated array after a new user feed is added/removed', async () => {
    const feedCount = (await request(app).get(`/user/feeds`)).body.length;

    const feedData = {
      author: user.name,
      url: 'http://telescope200.cdot.systems',
      user: user.id,
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');

    const incremented = (await request(app).get(`/user/feeds`)).body.length;
    expect(incremented).toEqual(feedCount + 1);

    await request(app).delete(`/feeds/${res.id}`);

    const decremented = (await request(app).get(`/user/feeds`)).body.length;
    expect(decremented).toEqual(incremented - 1);
  });
});
