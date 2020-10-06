const request = require('supertest');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/elastic');

describe('Testing query route', () => {
  test('Testing with valid characters', async () => {
    const searchTerm = 'I Love Telescope';
    const res = await request(app).get(`/query?search=${searchTerm}`);
    expect(res.status).toBe(200);
  });

  test('Testing with invalid characters', async () => {
    // searchTerm is 257 chars long
    const searchTerm =
      '8l4XOYWZ3SA9aevIozTcEAng3GOSCAiiDARThEkAFn2F2YtBexA3lcg1O38SGSHILQrrNYReKWOC6RM4ZQQIGqZoLSOLlbbYqlfSkIDM83aeGDYW7KU8OSLbIXUIWIF4TINwrjxi453biwyjgYsJeqFx9ORd0EIw3dMwGPWhoMbvTIxUWXV032qgPRmohLbTf8xnMyttPjIOk3rHBXpukWSnkZiKyBMsUniZZnxYPw7yIhfoaS77jIPRUuiQufDdO';
    const res = await request(app).get(`/query?search=${searchTerm}`);
    expect(res.status).toBe(400);
  });
});
