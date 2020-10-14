const request = require('supertest');

const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/indexer');

// Mock the internal authentication strategy
jest.mock('../src/backend/web/authentication');
// Use our authentication test helper
const { login, loginAdmin, logout } = require('./lib/authentication');

describe('test GET /user/info endpoint', () => {
  afterAll(() => logout());

  it('should respond with a 403 status when not logged in', async () => {
    logout();
    const res = await request(app).get(`/user/info`);
    expect(res.status).toEqual(403);
  });

  it('should respond with a 200 status and JSON Object for logged in user', async () => {
    const user = login();

    const res = await request(app).get(`/user/info`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Object).toBe(true);

    // Data should match our logged in user
    expect(res.body.name).toEqual(user.name);
    expect(res.body.email).toEqual(user.email);
    expect(res.body.id).toEqual(user.id);

    // We are not an admin, so that should be false
    expect(res.body.isAdmin).toEqual(user.isAdmin);
    expect(res.body.isAdmin).toBe(false);
  });

  it('should respond with a 200 status and JSON Object for logged in admin', async () => {
    const user = loginAdmin();

    const res = await request(app).get(`/user/info`);
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Object).toBe(true);

    // Data should match our logged in user
    expect(res.body.name).toEqual(user.name);
    expect(res.body.email).toEqual(user.email);
    expect(res.body.id).toEqual(user.id);

    // We are an admin, so that should be true
    expect(res.body.isAdmin).toEqual(user.isAdmin);
    expect(res.body.isAdmin).toBe(true);
  });
});

describe('test GET /user/feeds endpoint', () => {
  afterAll(() => logout());

  it('should respond with a 403 status when not logged in', async () => {
    logout();
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

  it('should get all feeds when logged in as admin', async () => {
    loginAdmin();

    // Get feeds for admin user using /user/feeds
    const res1 = await request(app).get(`/user/feeds`);
    expect(res1.status).toEqual(200);
    expect(res1.get('Content-type')).toContain('application/json');
    expect(res1.body instanceof Array).toBe(true);

    // Get all feeds using /feeds route
    const res2 = await request(app).get(`/feeds`);
    expect(res2.status).toEqual(200);
    expect(res2.get('Content-type')).toContain('application/json');
    expect(res2.body instanceof Array).toBe(true);

    // Make sure the two sets of feed arrays match
    expect(res2.body).toEqual(res1.body);
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

    const del = await request(app).delete(`/feeds/${res.body.id}`);
    expect(del.status).toEqual(204);

    const decremented = (await request(app).get(`/user/feeds`)).body.length;
    expect(decremented).toEqual(incremented - 1);
  });
});
