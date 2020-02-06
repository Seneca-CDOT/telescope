const xmlParser = require('fast-xml-parser');
const request = require('supertest');
const app = require('../src/backend/web/app');

describe('GET "/feed/atom" endpoint', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/feed/atom');
  });

  it('should respond with status 200 and content-type application/atom+xml', () => {
    expect(response.status).toEqual(200);
    expect(response.get('Content-type')).toContain('application/atom+xml');
  });

  it('should respond with a valid XML string that contains all expected elements', () => {
    expect(xmlParser.validate(response.text)).toBe(true);

    const atomObj = xmlParser.parse(response.text);

    expect(Object.keys(atomObj)).toEqual(['feed']);
    expect(Object.keys(atomObj.feed).sort()).toEqual(
      ['id', 'title', 'updated', 'generator', 'link', 'subtitle', 'rights', 'category'].sort()
    );
  });
});
