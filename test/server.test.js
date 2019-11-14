const request = require('supertest');
const app = require('../src/backend/web/app');

describe('Health Check', () => {
  it('should return a JSON object with property "uptime"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('GET "/" endpoint', () => {
  it('should return status 200 and content-type of text/html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.get('Content-type')).toContain('text/html');
  });
});
