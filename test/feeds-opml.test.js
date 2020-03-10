const xmlParser = require('fast-xml-parser');
const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/lib/elastic');

describe('GET "/feed/opml" endpoint', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/feed/opml');
  });

  it('should respond with status 200 and content-type text/x-opml', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('text/x-opml');
  });

  it('should respond with a valid XML string that contains all expected elements', () => {
    expect(xmlParser.validate(response.text)).toBe(true);

    const opmlObj = xmlParser.parse(response.text);

    expect(Object.keys(opmlObj)).toEqual(['opml']);
    expect(Object.keys(opmlObj.opml)).toEqual(['head', 'body']);
    expect(Object.keys(opmlObj.opml.head).sort()).toEqual(
      ['title', 'dateCreated', 'ownerName'].sort()
    );
    expect(opmlObj.opml.body).toBeDefined();
  });
});
