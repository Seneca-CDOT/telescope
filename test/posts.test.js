const request = require('supertest');
const app = require('../src/backend/web/app');
const Post = require('../src/backend/post');
const { addPost } = require('../src/backend/utils/storage');

describe('test /posts endpoint', () => {
  const defaultItems = 30;
  const requestedItems = 50;
  const maxItems = 100;
  const createdItems = 150;

  const posts = [...Array(createdItems).keys()].map(guid => {
    return {
      guid: `${guid}`,
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

  beforeAll(() => {
    Promise.all(posts.map(post => addPost(post)));
  });

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
  const existingGuid = 'existing-guid';
  const missingGuid = 'missing-guid';
  const existingNeedingEncoding = 'guid needing/encoding';
  const missingNeedingEncoding = 'missing needing/encoding';

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
    guid: 'existing-guid',
  };

  // an object to be added for testing purposes
  const addedPost2 = new Post(
    'bar',
    'bar',
    '',
    'bar',
    new Date('2010-09-07T22:20:00.000Z'),
    new Date('2010-09-07T22:23:00.000Z'),
    'bar',
    'bar',
    existingNeedingEncoding
  );

  // an object, expected to be returned by a correct query
  const receivedPost2 = {
    author: 'bar',
    title: 'bar',
    html: '',
    text: 'bar',
    published: '2010-09-07T22:20:00.000Z',
    updated: '2010-09-07T22:23:00.000Z',
    url: 'bar',
    site: 'bar',
    guid: 'guid needing/encoding',
  };

  // add the post to the storage
  beforeAll(async () => {
    addedPost1.save();
    addedPost2.save();
  });

  // tests
  it("pass a guid that doesn't exist", async () => {
    const res = await request(app).get(`/posts/${missingGuid}`);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(false);
  });

  it('pass a guid that exists', async () => {
    const res = await request(app).get(`/posts/${existingGuid}`);

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(receivedPost1);
    expect(res.body instanceof Array).toBe(false);
  });

  it("pass an encoded guid that doesn't exist", async () => {
    const res = await request(app).get(`/posts/${encodeURIComponent(missingNeedingEncoding)}`);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body instanceof Array).toBe(false);
  });

  it('pass an encoded guid that exists', async () => {
    const res = await request(app).get(`/posts/${encodeURIComponent(existingNeedingEncoding)}`);

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(receivedPost2);
    expect(res.body instanceof Array).toBe(false);
  });
});
