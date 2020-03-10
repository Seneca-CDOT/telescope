const request = require('supertest');
const app = require('../src/backend/web/app');
const Feed = require('../src/backend/data/feed');

jest.mock('../src/backend/lib/elastic');

describe('GET "/feed/wiki" endpoint', () => {
  let response;
  const testFeedAuthor = 'humphd';
  const testFeedURL = 'https://blog.humphd.org/tag/seneca/rss/';

  beforeAll(async () => {
    // Add test feed to mock Redis
    await new Feed(testFeedAuthor, testFeedURL).save();
    response = await request(app).get('/feed/wiki');
  });

  it('should respond with status 200 and content-type text/plain', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('text/plain');
  });

  it('should respond with text that matches the expected format for wiki feeds', () => {
    expect(response.text.includes(`[${testFeedURL}]\nname=${testFeedAuthor}`)).toBe(true);
  });
});
