const crypto = require('crypto');
const normalizeUrl = require('normalize-url');
const request = require('supertest');
const app = require('../src/backend/web/app');
const Post = require('../src/backend/post');
const { addPost } = require('../src/backend/utils/storage');

const encodeKey = url => {
  return crypto
    .createHash('sha256')
    .update(normalizeUrl(url))
    .digest('base64');
};

describe('test /posts endpoint', () => {
  const defaultItems = 30;
  const requestedItems = 50;
  const maxItems = 100;
  const createdItems = 150;

  const posts = [...Array(createdItems).keys()].map(guid => {
    return {
      guid: `http://telescope${guid}.cdot.systems`,
      author: 'foo',
      title: 'foo',
      link: 'foo',
      content: 'foo',
      text: 'foo',
      updated: new Date('2009-09-07T22:23:00.544Z'),
      published: new Date('2009-09-07T22:20:00.000Z'),
      url: 'foo',
      site: 'foo',
    };
  });

  beforeAll(() => Promise.all(posts.map(post => addPost(post))));

  it('requests default number of items', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(defaultItems);
    expect(res.body instanceof Array).toBe(true);
  });

  it('requests a specific number of items', async () => {
    const res = await request(app).get('/posts?per_page=50');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(requestedItems);
    expect(res.body instanceof Array).toBe(true);
  });

  it('requests more items than the limit set by the server', async () => {
    const res = await request(app).get('/posts?per_page=150');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.get('X-Total-Count')).toBe(createdItems.toString());
    expect(res.body.length).toBe(maxItems);
    expect(res.body instanceof Array).toBe(true);
  });
});

describe('test /posts/:guid responses', () => {
  // an array of keys.
  const existingGuid = 'http://existing-guid';
  const missingGuid = 'http://missing-guid';

  // an object to be added for testing purposes
  const addedPost1 = new Post(
    'foo',
    'foo',
    '',
    'foo',
    new Date('2009-09-07T22:20:00.000Z'),
    new Date('2009-09-07T22:23:00.000Z'),
    'foo',
    'foo',
    existingGuid
  );

  // an object, expected to be returned by a correct query
  const receivedPost1 = {
    author: 'foo',
    title: 'foo',
    html: '',
    text: 'foo',
    published: '2009-09-07T22:20:00.000Z',
    updated: '2009-09-07T22:23:00.000Z',
    url: 'foo',
    site: 'foo',
    guid: 'http://existing-guid',
  };

  // add the post to the storage
  beforeAll(() => addedPost1.save());

  // tests
  it("pass an encoded guid that doesn't exist", async () => {
    const res = await request(app).get(`/posts/${encodeURIComponent(encodeKey(missingGuid))}`);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(false);
  });

  it('pass an encoded guid that exists', async () => {
    const res = await request(app).get(`/posts/${encodeURIComponent(encodeKey(existingGuid))}`);

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(receivedPost1);
    expect(res.body instanceof Array).toBe(false);
  });
});
