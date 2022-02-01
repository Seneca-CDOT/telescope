const request = require('supertest');
const { app } = require('../src');

describe('/query routers', () => {
  it('return error 400 if no params given', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(400);
  });
});
