const xmlParser = require('fast-xml-parser');
const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/indexer');

describe('GET "/feed/rss" endpoint', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/feed/rss');
  });

  it('should respond with status 200 and content-type application/rss+xml', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('application/rss+xml');
  });

  it('should respond with a valid XML string that contains all expected elements', () => {
    expect(xmlParser.validate(response.text)).toBe(true);

    const rssObj = xmlParser.parse(response.text);

    expect(Object.keys(rssObj)).toEqual(['rss']);
    expect(Object.keys(rssObj.rss)).toEqual(['channel']);
    expect(Object.keys(rssObj.rss.channel).sort()).toEqual(
      [
        'title',
        'link',
        'description',
        'lastBuildDate',
        'docs',
        'generator',
        'language',
        'copyright',
        'category',
        'atom:link',
      ].sort()
    );
  });
});
