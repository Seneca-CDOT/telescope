const request = require('supertest');
const app = require('../src/backend/web/app');

describe('GET "/feed/wiki" endpoint', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/feed/wiki');
  });

  it('should respond with status 200 and content-type text/plain', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('text/plain');
  });
});
