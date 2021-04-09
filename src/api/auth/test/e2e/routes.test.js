// NOTE: you need to run the auth and login services in docker for these to work
const request = require('supertest');
const { app } = require('../../src');

it('should use the same origin in .env for ALLOWED_APP_ORIGINS that test cases use', () => {
  const origins = process.env.ALLOWED_APP_ORIGINS.split(' ');
  expect(origins).toContain('http://localhost:8888');
});

describe('/login', () => {
  it('should respond with 400 to non-URI in redirect_uri param', (done) => {
    request(app).get('/login').expect(400, done);
  });

  it('should respond with 401 to unknown URI in redirect_uri param', (done) => {
    request(app).get('/login?redirect_uri=http://unknown.com').expect(401, done);
  });

  it('should respond with 302 to known app URI in redirect_uri param', (done) => {
    request(app).get('/login?redirect_uri=http://localhost:8888').expect(302, done);
  });

  it('should respond with 302 to known app URI in redirect_uri param with state', (done) => {
    request(app).get('/login?redirect_uri=http://localhost:8888&state=abc123').expect(302, done);
  });

  it('should respond with 302 to POST login callback without proper flow', (done) => {
    request(app).post('/login/callback').expect(302, done);
  });
});

describe('/logout', () => {
  it('should respond with 400 to logout request without token', (done) => {
    request(app).get('/logout').expect(400, done);
  });

  it('should respond with 400 to GET logout callback without proper flow', (done) => {
    request(app).get('/logout/callback').expect(400, done);
  });

  it('should respond with 400 to POST logout callback without proper flow', (done) => {
    request(app).post('/logout/callback').expect(400, done);
  });
});

describe('/sp', () => {
  it('should respond with XML', (done) => {
    request(app)
      .get('/sp')
      .expect('Content-Type', 'application/xml; charset=utf-8')
      .expect(200, done);
  });
});
