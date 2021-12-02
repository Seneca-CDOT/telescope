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
describe('Test GET /feeds/delayed endpoint', () => {
  const createdItems = 150;
  // Array of feeds
  const feeds = [...Array(createdItems).keys()].map((item) => {
    return new Feed('foo', `http://telescope${item}.cdot.systems`);
  });
  beforeAll(() => Promise.all(feeds.map((feed) => feed.save())));

  it('Should return 200 and empty body when there are no delayed feeds', async () => {
    const res = await request(app).get('/feeds/delayed');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe('0');
    expect(res.body.length).toBe(0);
    expect(res.body instanceof Array).toBe(true);
  });

  it('Should return 200 and delayed feeds object', async () => {
    // arrange invalid feeds
    const createDelayedFeeds = 10;
    for (let i = 0; i < createDelayedFeeds; i += 1) {
      feeds[i].setDelayed(3600);
    }
    const res = await request(app).get('/feeds/delayed');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createDelayedFeeds.toString());
    expect(res.body.length).toBe(createDelayedFeeds);
    expect(res.body instanceof Array).toBe(true);
    expect(res.body[0].id).toBe(feeds[0].id);
  });
});

describe('GET /feeds/info', () => {
  test('Should return 200 and valid response object', async () => {
    function checkKeys(resBody) {
      let bool = true;
      const allKeys = ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused', 'jobCnt'];
      const resKeys = Object.keys(resBody.queueInfo);
      for (let i = 0; i < resKeys.length; i += 1) {
        if (allKeys.indexOf(resKeys[i]) < 0 || typeof resBody.queueInfo[resKeys[i]] !== 'number') {
          bool = false;
          break;
        }
      }
      return bool;
    }

    const res = await request(app).get('/feeds/info');

    expect(res.status).toEqual(200);
    expect(typeof res.body).toEqual('object');
    expect(typeof res.body.queueInfo).toEqual('object');
    expect(checkKeys(res.body)).toBe(true);
  });
});
