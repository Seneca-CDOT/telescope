const { test, expect } = require('@playwright/test');

// NOTE: you need to run the sso and login services in docker for these to work
const request = require('supertest');
const { app } = require('../../src');

test('should use the same origin in .env for ALLOWED_APP_ORIGINS that test cases use', () => {
  const origins = process.env.ALLOWED_APP_ORIGINS.split(' ');
  expect(origins).toContain('http://localhost:8888');
});

test.describe('/login', () => {
  test('should respond with 400 to non-URI in redirect_uri param', () =>
    request(app).get('/login').expect(400));

  test('should respond with 401 to unknown URI in redirect_uri param', () =>
    request(app).get('/login?redirect_uri=http://unknown.com').expect(401));

  test('should respond with 302 to known app URI in redirect_uri param', () =>
    request(app).get('/login?redirect_uri=http://localhost:8888').expect(302));

  test('should respond with 302 to known app URI in redirect_uri param with state', () =>
    request(app).get('/login?redirect_uri=http://localhost:8888&state=abc123').expect(302));

  test('should respond with 302 to POST login callback without proper flow', () =>
    request(app).post('/login/callback').expect(302));
});

test.describe('/logout', () => {
  test('should respond with 400 to logout request without token', () =>
    request(app).get('/logout').expect(400));

  test('should respond with 400 to GET logout callback without proper flow', () =>
    request(app).get('/logout/callback').expect(400));

  test('should respond with 400 to POST logout callback without proper flow', () =>
    request(app).post('/logout/callback').expect(400));
});

test.describe('/sp', () => {
  test('should respond with XML', () =>
    request(app).get('/sp').expect('Content-Type', 'application/xml; charset=utf-8').expect(200));
});
