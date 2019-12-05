const request = require('supertest');
const app = require('../src/backend/web/app');
const { addPost } = require('../src/backend/utils/storage');

describe('test /posts endpoint', async () => {
  const defaultItems = 30;
  const requestedItems = 50;
  const maxItems = 100;

  const posts = [...Array(150).keys()].map(index => {
    return {
      guid: `${index}`,
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

  it('testing returning default number of items: 30', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(defaultItems);
  });

  it('testing returning requested number of items: 50', async () => {
    const res = await request(app).get('/posts?per_page=50');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(requestedItems);
  });

  it('testing returning max number of items: 100', async () => {
    const res = await request(app).get('/posts?per_page=150');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.length).toBe(maxItems);
  });
});
