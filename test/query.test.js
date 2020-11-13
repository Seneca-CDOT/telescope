const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/indexer');

describe('Testing query route', () => {
  test('Testing with valid length of characters', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post`);
    expect(res.status).toBe(200);
  });

  test('Testing with invalid length of characters', async () => {
    // searchTerm is 257 chars long
    const searchTerm = encodeURIComponent(
      '8l4XOYWZ3SA9aevIozTcEAng3GOSCAiiDARThEkAFn2F2YtBexA3lcg1O38SGSHILQrrNYReKWOC6RM4ZQQIGqZoLSOLlbbYqlfSkIDM83aeGDYW7KU8OSLbIXUIWIF4TINwrjxi453biwyjgYsJeqFx9ORd0EIw3dMwGPWhoMbvTIxUWXV032qgPRmohLbTf8xnMyttPjIOk3rHBXpukWSnkZiKyBMsUniZZnxYPw7yIhfoaS77jIPRUuiQufDdO'
    );
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post`);
    expect(searchTerm.length).toBeGreaterThan(256);
    expect(res.status).toBe(400);
  });
});
