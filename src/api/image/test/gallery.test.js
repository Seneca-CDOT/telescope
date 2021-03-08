const request = require('supertest');
const { app } = require('../src');

describe('/gallery', () => {
  it('should return HTML content', (done) => {
    request(app)
      .get('/gallery')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });

  it('should include <img> elements', (done) => {
    request(app)
      .get('/gallery')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        expect(err).toBe(null);

        const body = res.text;
        expect(body).toMatch(/<img src="[^"]+" width="300" height="300" loading="lazy">/gm);
        done();
      });
  });
});
