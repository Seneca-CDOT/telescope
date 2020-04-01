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
    const res = await request(app)
      .post('/feeds')
      .send(feedData)
      .set('Accept', 'application/json');
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
