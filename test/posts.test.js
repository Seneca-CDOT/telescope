const request = require('supertest');
const app = require('../src/backend/web/app');
const { addPost } = require('../src/backend/utils/storage');

describe('test /posts endpoint', async () => {
  const defaultItems = 30;
  const requestedItems = 50;
  const maxItems = 100;

  const posts = [...Array(150).keys()].map(guid => {
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
    // Requests default number of items
    const res = await request(app).get('/posts');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(defaultItems);
  });

  it('requests a specific number of items', async () => {
    const res = await request(app).get('/posts?per_page=50');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(requestedItems);
  });

  it('requests more items than the limit set by the server', async () => {
    const res = await request(app).get('/posts?per_page=150');

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(maxItems);
  });
});
