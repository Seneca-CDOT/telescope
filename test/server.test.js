const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/lib/elastic');

describe('Health Check', () => {
  it('should return a JSON object with property "uptime"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uptime');
  });
});
