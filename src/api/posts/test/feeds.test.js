const request = require('supertest');
const { app } = require('../src');
const Feed = require('../src/data/feed');

describe('Test GET /feeds/invalid endpoint', () => {
  const createdItems = 150;
  // Array of feeds
  const feeds = [...Array(createdItems).keys()].map((item) => {
    return new Feed('foo', `http://telescope${item}.cdot.systems`);
  });
  beforeAll(() => Promise.all(feeds.map((feed) => feed.save())));

  it('Should return 200 and empty body when there are no invalid feeds', async () => {
    const res = await request(app).get('/feeds/invalid');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe('0');
    expect(res.body.length).toBe(0);
    expect(res.body instanceof Array).toBe(true);
  });

  it('Should return 200 and invalid feeds object', async () => {
    // arrange invalid feeds
    const createdInvalidFeeds = 20;
    for (let i = 0; i < createdInvalidFeeds; i += 1) {
      feeds[i].setInvalid('test');
    }
    const res = await request(app).get('/feeds/invalid');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdInvalidFeeds.toString());
    expect(res.body.length).toBe(createdInvalidFeeds);
    expect(res.body instanceof Array).toBe(true);
    expect(res.body[0].reason).toBe('test');
    expect(res.body[0].id).toBe(feeds[0].id);
  });
});
