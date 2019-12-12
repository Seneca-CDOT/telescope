const request = require('supertest');
const app = require('../src/backend/web/app');
const { addPost } = require('../src/backend/utils/storage');

describe('test /post responses', () => {
  // an array of keys.
  const keys = [100, 101];

  // an object to be added to the storage for testing purposes
  const toBeAdded = {
    guid: `${keys[0]}`,
    author: 'foo',
    title: 'foo',
    link: 'foo',
    content: 'foo',
    text: 'foo',
    updated: new Date('2009-09-07T22:23:00.544Z'),
    published: new Date('2009-09-07T22:20:00.000Z'),
    html: '',
    url: 'foo',
    site: 'foo',
  };

  // an object, expected to be returned by a correct querry
  const returned = {
    guid: '100',
    author: 'foo',
    title: 'foo',
    html: '',
    text: 'foo',
    published: '2009-09-07T22:20:00.000Z',
    updated: '2009-09-07T22:23:00.000Z',
    url: 'foo',
    site: 'foo',
  };

  // add the post to the storage
  beforeAll(() => {
    new Promise(() => addPost(toBeAdded));
  });

  // tests
  it("pass a guid that doesn't exist", async () => {
    const res = await request(app).get('/post/' + keys[1]);

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.message).toEqual('Post not found for id 101');
  });

  it('pass a guid that exists', async () => {
    const res = await request(app).get('/post/' + keys[0]);

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(returned);
  });

  it("pass an encoded guid that doesn't exist", async () => {
    const res = await request(app).get(encodeURI('/post/' + keys[1]));

    expect(res.status).toEqual(404);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body.message).toEqual('Post not found for id 101');
  });

  it('pass an encoded guid that exists', async () => {
    const res = await request(app).get(encodeURI('/post/' + keys[0]));

    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('application/json');
    expect(res.body).toEqual(returned);
  });
});
