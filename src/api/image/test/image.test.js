const request = require('supertest');
const sharp = require('sharp');
const { app } = require('../src');

describe('/image', () => {
  it('should return 400 when requesting an unknown image', (done) => {
    request(app).get('/unknown-image').expect(400, done);
  });

  it('should return 200 when requesting a known image', (done) => {
    request(app).get('/default.jpg').expect(200, done);
  });

  it('should return 200 when requesting no image', (done) => {
    request(app).get('/').expect(200, done);
  });

  it('should return a WebP with width 800px by default', (done) => {
    request(app)
      .get('/')
      .responseType('arraybuffer')
      .expect(200)
      .expect('Content-Type', 'image/webp')
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        const image = sharp(res.body);
        const metadata = await image.metadata();
        expect(metadata.format).toEqual('webp');
        expect(metadata.width).toBe(800);
        expect(metadata.height).toBeGreaterThan(200);
        return done();
      });
  });

  it('should return a WebP if Accept header includes it', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'image/webp,*/*')
      .expect('Content-Type', 'image/webp')
      .expect(200, done);
  });

  it('should return a JPEG when requested', (done) => {
    request(app).get('/?t=jpeg').expect('Content-Type', 'image/jpeg').expect(200, done);
  });

  it('should return a JPG when requested', (done) => {
    request(app).get('/?t=jpg').expect('Content-Type', 'image/jpeg').expect(200, done);
  });

  it('should return a PNG when requested', (done) => {
    request(app).get('/?t=png').expect('Content-Type', 'image/png').expect(200, done);
  });

  it('should return a WebP when requested', (done) => {
    request(app).get('/?t=webp').expect('Content-Type', 'image/webp').expect(200, done);
  });

  it('should return 400 if type is unknown', (done) => {
    request(app).get('/?t=unknown').expect(400, done);
  });

  it('should return 400 if width is not a number', (done) => {
    request(app).get('/?w=one').expect(400, done);
  });

  it('should return 400 if width is under 200', (done) => {
    request(app).get('/?w=199').expect(400, done);
  });

  it('should return 400 if width is over 2000', (done) => {
    request(app).get('/?w=2001').expect(400, done);
  });

  it('should return 400 if height is not a number', (done) => {
    request(app).get('/?h=one').expect(400, done);
  });

  it('should return 400 if height is under 200', (done) => {
    request(app).get('/?h=199').expect(400, done);
  });

  it('should return 400 if height is over 3000', (done) => {
    request(app).get('/?h=3001').expect(400, done);
  });

  it('should return 400 if image name has invalid characters', (done) => {
    request(app).get('/../package.json').expect(400, done);
  });

  it('should return a valid image of the expected type and size', (done) => {
    request(app)
      .get('/?t=png&w=400&h=500')
      .responseType('arraybuffer')
      .expect(200)
      .expect('Content-Type', 'image/png')
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        const image = sharp(res.body);
        const metadata = await image.metadata();
        expect(metadata.format).toEqual('png');
        expect(metadata.width).toBe(400);
        expect(metadata.height).toBe(500);
        return done();
      });
  });
});
