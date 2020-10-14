const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/indexer');

describe('Health Check', () => {
  it('should return a JSON object with property "status"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('ok');
  });

  it('should return a JSON object with property "info"', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('info');
    expect(res.body.info).toHaveProperty('gitHubUrl');
    expect(res.body.info).toHaveProperty('sha');
    expect(res.body.info).toHaveProperty('version');
  });
});
