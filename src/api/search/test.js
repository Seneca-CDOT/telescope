const request = require('supertest');
process.env.ELASTICSEARCH_HOSTS = 'http://elasticsearch:9200';

const app = require('./server');

describe('Testing query route', () => {
  test('Testing with valid length of characters for text', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post`);
    expect(res.status).toBe(200);
  });

  test('Testing with invalid length of characters for text', async () => {
    // searchTerm is 257 chars long
    const searchTerm = encodeURIComponent(
      '8l4XOYWZ3SA9aevIozTcEAng3GOSCAiiDARThEkAFn2F2YtBexA3lcg1O38SGSHILQrrNYReKWOC6RM4ZQQIGqZoLSOLlbbYqlfSkIDM83aeGDYW7KU8OSLbIXUIWIF4TINwrjxi453biwyjgYsJeqFx9ORd0EIw3dMwGPWhoMbvTIxUWXV032qgPRmohLbTf8xnMyttPjIOk3rHBXpukWSnkZiKyBMsUniZZnxYPw7yIhfoaS77jIPRUuiQufDdO'
    );
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post`);
    expect(searchTerm.length).toBeGreaterThan(256);
    expect(res.status).toBe(400);
  });

  test('Testing with missing text param', async () => {
    const res = await request(app).get('/query?filter=post');
    expect(res.status).toBe(400);
  });

  test('Testing with missing filter param', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}`);
    expect(res.status).toBe(400);
  });

  test('Testing with invalid filter', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=test`);
    expect(res.status).toBe(400);
  });

  test('Testing with valid post filter', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post`);
    expect(res.status).toBe(200);
  });

  test('Testing with valid author filter', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=author`);
    expect(res.status).toBe(200);
  });

  test('Testing with empty param values', async () => {
    const res = await request(app).get(`/query?text=&filter=`);
    expect(res.status).toBe(400);
  });

  test('Testing with empty page value', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=`);
    expect(res.status).toBe(400);
  });

  test('Testing with invalid page value', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=invalid`);
    expect(res.status).toBe(400);
  });

  test('Testing with page above range', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=1000`);
    expect(res.status).toBe(400);
  });

  test('Testing with page below range', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=-1`);
    expect(res.status).toBe(400);
  });

  test('Testing with valid page in range', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=1`);
    expect(res.status).toBe(200);
  });

  test('Testing with empty per page value', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=0&perPage=`);
    expect(res.status).toBe(400);
  });

  test('Testing with invalid per page value', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(
      `/query?text=${searchTerm}&filter=post&page=0&perPage=invalid`
    );
    expect(res.status).toBe(400);
  });

  test('Testing with per page above range ', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=0&perPage=11`);
    expect(res.status).toBe(400);
  });

  test('Testing with per page below range ', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=0&perPage=0`);
    expect(res.status).toBe(400);
  });

  test('Testing with valid per page in range ', async () => {
    const searchTerm = encodeURIComponent('I Love Telescope');
    const res = await request(app).get(`/query?text=${searchTerm}&filter=post&page=0&perPage=3`);
    expect(res.status).toBe(200);
  });
});
