const request = require('supertest');

const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/elastic');

// Mock the internal authentication strategy
jest.mock('../src/backend/web/authentication');
// Use our authentication test helper
const { login, logout } = require('./lib/authentication');

describe.skip('test GET /user/feeds endpoint', () => {
  afterAll(() => logout());

  it('should respond with a 403 status when not logged in', async () => {
    const res = await request(app).get(`/user/feeds`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 200 status and JSON array if logged in', async () => {
    login('Johannes Kepler', 'user1@example.com');
    const res = await request(app).get(`/user/feeds`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(true);
  });

  it('should respond with an updated array after a new user feed is added/removed', async () => {
    const user = login('Johannes Kepler', 'user1@example.com');
    const feedCount = (await request(app).get(`/user/feeds`)).body.length;

    const feedData = {
      author: user.name,
      url: 'http://telescope200.cdot.systems',
      user: user.id,
    };
    const res = await request(app).post('/feeds').send(feedData).set('Accept', 'application/json');
    expect(res.status).toEqual(201);

    const incremented = (await request(app).get(`/user/feeds`)).body.length;
    expect(incremented).toEqual(feedCount + 1);

    await request(app).delete(`/feeds/${res.id}`);
    expect(res.status).toEqual(204);

    const decremented = (await request(app).get(`/user/feeds`)).body.length;
    expect(decremented).toEqual(incremented - 1);
  });
});
