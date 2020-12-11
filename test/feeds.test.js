const request = require('supertest');

const app = require('../src/backend/web/app');
const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

jest.mock('../src/backend/utils/indexer');

// Mock the internal authentication strategy
jest.mock('../src/backend/web/authentication');
// Use our authentication test helper
const { login, loginAdmin, logout } = require('./lib/authentication');

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

  it('Should return 400 that is less than 10 characters', async () => {
    const id = '123456789';
    const res = await request(app).get(`/feeds/${id}`);

    expect(res.status).toEqual(400);
  });

  it('Should return 400 that is more than 10 characters', async () => {
    const id = '12345678912';
    const res = await request(app).get(`/feeds/${id}`);

    expect(res.status).toEqual(400);
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

  it('returns 400 if no author being sent (ie: author is null or empty string)', async () => {
    const feedData = {
      user: 'user',
      url: 'http://telescope200.cdot.systems',
    };

    feedData.author = null;
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);

    feedData.author = '';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('returns 400 if author provided is a number instead of string', async () => {
    const feedData = {
      author: 100,
      user: 'user',
      url: 'http://telescope200.cdot.systems',
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('returns 400 if no url being sent (ie: url is null or empty string)', async () => {
    const feedData = {
      author: 'foo',
      user: 'user',
    };

    feedData.url = null;
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);

    feedData.url = '';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('returns 400 if url provided is a number instead of a string', async () => {
    const feedData = {
      author: 'foo',
      user: 'user',
      url: 100,
    };

    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('returns 400 if url is invalid', async () => {
    const feedData = {
      author: 'foo',
      user: 'user',
    };

    feedData.url = 'www.invalidURL.com';
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);

    feedData.url = 'chrome://www.google.com';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it(`returns 201 if url is valid`, async () => {
    const feedData = {
      author: 'foo',
      user: 'user',
    };

    /** The sample links were common patterns from the valid feed list
     *  https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List#Feeds
     * */

    feedData.url = 'http://joy3van.blogspot.com/feeds/posts/default/-/Open-Source?alt=rss';
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'https://dev.to/feed/henryzerocool/';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'https://medium.com/feed/@random4900';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'https://badalsarkar.ca/blog-opensource/feed.xml';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'https://medium.com/feed/programmer-and-a-scholar/tagged/opensource';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'http://www.hodgin.ca/?feed=rss2&cat=4';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'http://blog.auios.com/feed.php';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    feedData.url = 'http://dailypackage.fedorabook.com/index.php?/feeds/index.rss2';
    res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
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

describe('test DELETE /feeds/cache endpoint', () => {
  it('should respond with a 403 status trying to clear cache without logging in', async () => {
    const res = await request(app).delete('/feeds/cache').send().set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 403 status trying to clear cache when logged in as normal user', async () => {
    login('Johannes Kepler', 'user1@example.com');
    const res = await request(app).delete('/feeds/cache').send().set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 204 status trying to clear cache when logged in as admin user', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app).delete('/feeds/cache').send().set('Accept', 'application/json');
    expect(res.status).toEqual(204);
  });

  it('should respond with a 204 and all existing feed etag + lastModified be null', async () => {
    const data = {
      author: 'Post Author',
      url: 'https://user.feed.com/feed.rss',
      user: 'user',
      link: 'https://user.feed.com/',
      etag: 'etag',
      lastModified: 'lastModified',
    };

    const data2 = {
      author: 'Post Author2',
      url: 'https://user2.feed.com/feed.rss',
      user: 'user2',
      link: 'https://user2.feed.com/',
      etag: 'etag',
      lastModified: 'lastModified',
    };

    const data3 = {
      author: 'Post Author3',
      url: 'https://user3.feed.com/feed.rss',
      user: 'user',
      link: 'https://user3.feed.com/',
      etag: 'etag',
      lastModified: 'lastModified',
    };

    const feedIds = await Promise.all([Feed.create(data), Feed.create(data2), Feed.create(data3)]);
    const feeds = await Promise.all(feedIds.map(Feed.byId));

    // Checking db against data
    expect(feeds[0].etag).toBe('etag');
    expect(feeds[1].etag).toBe('etag');
    expect(feeds[2].etag).toBe('etag');
    expect(feeds[0].lastModified).toBe('lastModified');
    expect(feeds[1].lastModified).toBe('lastModified');
    expect(feeds[2].lastModified).toBe('lastModified');

    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app).delete('/feeds/cache').send().set('Accept', 'application/json');
    expect(res.status).toBe(204);

    // Checking db for updated values after put route
    const clearedFeeds = await Promise.all(feedIds.map(Feed.byId));
    expect(clearedFeeds[0].etag).toBe(null);
    expect(clearedFeeds[1].etag).toBe(null);
    expect(clearedFeeds[2].etag).toBe(null);
    expect(clearedFeeds[0].lastModified).toBe(null);
    expect(clearedFeeds[1].lastModified).toBe(null);
    expect(clearedFeeds[2].lastModified).toBe(null);
  });
});

describe('test DELETE /feeds/:id endpoint', () => {
  let feedId;
  function generateFeedData(user) {
    return {
      author: user.name,
      url: `http://telescope200.cdot.systems/${Date.now()}`,
      user: user.id,
    };
  }

  it('should respond with a 403 status when not logged in', async () => {
    // logging in user and generating a user
    const user = login('Johannes Kepler', 'user1@example.com');
    const feedData = generateFeedData(user);
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    feedId = res.body.id;

    // Deleting a feed for a user who is not logged in
    logout();
    res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 403 status when targeted feed is not owned by user', async () => {
    // logging in user and generating a user
    const user = login('Johannes Kepler', 'user1@example.com');
    const feedData = generateFeedData(user);
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    feedId = res.body.id;

    // logging in second user to delete a feed
    login('Galileo Galilei', 'user2@example.com');
    res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 204 status when targeted feed is owned by user', async () => {
    // logging in user and generating a user
    const user = login('Johannes Kepler', 'user1@example.com');
    const feedData = generateFeedData(user);
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    feedId = res.body.id;

    // delete the feed
    res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(204);

    // ensure deletion of the feed
    res = await request(app).get(`/feeds/${feedId}`);
    expect(res.status).toEqual(404);
  });

  it('should respond with a 204 status when admin deletes a feed owned by user', async () => {
    // logging in as regular user
    const user = login('Johannes Kepler', 'user1@example.com');
    const feedData = generateFeedData(user);
    let res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    feedId = res.body.id;

    // login as admin and delete the feed
    loginAdmin();
    res = await request(app).delete(`/feeds/${feedId}`);
    expect(res.status).toEqual(204);

    // ensure deletion of the feed
    logout();
    res = await request(app).get(`/feeds/${feedId}`);
    expect(res.status).toEqual(404);
  });

  it('should return 400 when id is less than 10 characters', async () => {
    const id = '123456789';
    const res = await request(app).delete(`/feeds/${id}`);

    expect(res.status).toEqual(400);
  });

  it('should return 400 when id is more than 10 characters', async () => {
    const id = '123456789123456789';
    const res = await request(app).delete(`/feeds/${id}`);

    expect(res.status).toEqual(400);
  });
});

describe('test PUT + DELETE /feeds/:id/flag endpoint', () => {
  const data = {
    author: 'Post Author',
    url: 'https://user.feed.com/feed.rss',
    user: 'user',
    link: 'https://user.feed.com/',
    etag: 'etag',
    lastModified: 'lastModified',
  };

  const data2 = {
    author: 'Post Author2',
    url: 'https://user2.feed.com/feed.rss',
    user: 'user2',
    link: 'https://user2.feed.com/',
    etag: 'etag',
    lastModified: 'lastModified',
  };

  const data3 = {
    author: 'Post Author3',
    url: 'https://user3.feed.com/feed.rss',
    user: 'user',
    link: 'https://user3.feed.com/',
    etag: 'etag',
    lastModified: 'lastModified',
  };

  beforeAll(() => Promise.all([Feed.create(data), Feed.create(data2), Feed.create(data3)]));
  beforeEach(() => logout());

  // Testing PUT
  it('should respond with a 403 status trying to flag feed without logging in', async () => {
    const feeds = await Feed.all();
    const res = await request(app)
      .put(`/feeds/${feeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 403 status trying to flag feed when logged in as normal user', async () => {
    const feeds = await Feed.all();
    login('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .put(`/feeds/${feeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 404 status trying to flag feed that does not exist when logged in as admin user', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .put(`/feeds/1234567890/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(404);
  });

  it('should respond with a 200 status trying to flag feed when logged in as admin user', async () => {
    const feeds = await Feed.all();
    // Initial check
    const initflaggedFeeds = await Feed.flagged();
    expect(initflaggedFeeds.length).toBe(0);

    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .put(`/feeds/${feeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    // Check updated # of flagged feeds
    const flaggedFeeds = await Feed.flagged();
    expect(flaggedFeeds.length).toEqual(1);
  });

  // Testing DELETE
  it('should respond with a 403 status trying to unflag feed without logging in', async () => {
    const feeds = await Feed.all();
    const res = await request(app)
      .delete(`/feeds/${feeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 403 status trying to unflag feed when logged in as normal user', async () => {
    const feeds = await Feed.all();
    login('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .delete(`/feeds/${feeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });

  it('should respond with a 400 status trying to unflag feed that has 9 digits when logged in as admin user', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .delete(`/feeds/123456789/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('should respond with a 400 status trying to unflag feed that has 12 digits when logged in as admin user', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .delete(`/feeds/123456789012/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('should respond with a 204 status trying to unflag feed when logged in as admin user', async () => {
    const initFlaggedFeeds = await Feed.flagged();
    // Initial check
    expect(initFlaggedFeeds.length).toBe(1);

    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .delete(`/feeds/${initFlaggedFeeds[0].id}/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(204);
    // Check updated # of flagged feeds
    const flaggedFeeds = await Feed.flagged();
    expect(flaggedFeeds.length).toEqual(0);
  });

  it('should respond with a 400 status because id url param is 9 characters but validation expects 10', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .put(`/feeds/123456789/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  it('should respond with a 400 status because id url param is 11 characters but validation expects 10', async () => {
    loginAdmin('Johannes Kepler', 'user1@example.com');
    const res = await request(app)
      .put(`/feeds/123456789012/flag`)
      .send()
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });
});
