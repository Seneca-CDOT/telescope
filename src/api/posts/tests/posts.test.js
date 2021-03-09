const request = require('supertest');

const { app } = require('../src');
const { addPost } = require('../src/storage');
const hash = require('../../auth/src/hash');

describe('/posts', () => {
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

  test('default number of items should be returned', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
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
