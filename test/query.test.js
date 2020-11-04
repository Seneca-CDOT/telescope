const request = require('supertest');
const { search, indexPost } = require('../src/backend/utils/__mocks__/indexer');
const app = require('../src/backend/web/app');

jest.mock('../src/backend/utils/indexer');

describe('Testing query route', () => {
  test('Testing with valid length of characters', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?search=${searchTerm}`);
    expect(res.status).toBe(200);
  });

  test('Testing with invalid length of characters', async () => {
    // searchTerm is 257 chars long
    const searchTerm = encodeURIComponent(
      '8l4XOYWZ3SA9aevIozTcEAng3GOSCAiiDARThEkAFn2F2YtBexA3lcg1O38SGSHILQrrNYReKWOC6RM4ZQQIGqZoLSOLlbbYqlfSkIDM83aeGDYW7KU8OSLbIXUIWIF4TINwrjxi453biwyjgYsJeqFx9ORd0EIw3dMwGPWhoMbvTIxUWXV032qgPRmohLbTf8xnMyttPjIOk3rHBXpukWSnkZiKyBMsUniZZnxYPw7yIhfoaS77jIPRUuiQufDdO'
    );
    const res = await request(app).get(`/query?search=${searchTerm}`);
    expect(searchTerm.length).toBeGreaterThan(256);
    expect(res.status).toBe(400);
  });

  test('Testing with search() returning only id', async () => {
    await indexPost('First test data is going to be posted.', 1000);
    await indexPost('Second real data is going to be posted.', 1001);
    await indexPost('Third test data is going to be posted.', 1002);
    await indexPost('Fource test data is going to be posted.', 1003);
    const elasticPosts = await search('test');
    expect(elasticPosts.values.length).toBe(3);
    expect(Object.keys(elasticPosts.values[0]).length).toBe(1);
    expect(Object.keys(elasticPosts.values[0])).toEqual(expect.arrayContaining(['id']));
    expect(Object.keys(elasticPosts.values[1])).toEqual(expect.arrayContaining(['id']));
  });
});
