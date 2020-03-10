const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/lib/elastic');

describe('GET "/feed/json" endpoint', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/feed/json');
  });

  it('should respond with status 200 and content-type application/json', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('application/json');
  });

  it('should respond with a valid JSON object that contains all expected elements', () => {
    let resJson;

    expect(() => {
      resJson = JSON.parse(response.text);
    }).not.toThrow();

    expect(Object.keys(resJson).sort()).toEqual(
      ['version', 'title', 'home_page_url', 'feed_url', 'description', 'items'].sort()
    );
  });
});
