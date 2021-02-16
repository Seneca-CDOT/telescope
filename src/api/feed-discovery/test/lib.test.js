const request = require('supertest');
const nock = require('nock');
const createError = require('http-errors');
const { app } = require('../src');
const { checkValidUrl, discoverFeedUrls } = require('../src/lib');

describe('POST /', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('Test checkValidUrl middleware', () => {
    it('should return 400 status if the url has invalid format', (done) => {
      const invalidUrl = 'invalidlink.com';
      const mockReq = {
        body: {
          blogUrl: invalidUrl,
        },
      };
      const mockRes = {};
      const mockNextFunction = jest.fn();
      checkValidUrl(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(400, 'Invalid Blog URL');

      // Expect the next() function to be called with the expected error
      expect(mockNextFunction).toBeCalledWith(expectedError);

      request(app)
        .post('/')
        .send({ blogUrl: invalidUrl })
        // Expect to receive 400 status and expected response body
        .expect(400, done);
    });

    it('should call next() if the url has valid format', (done) => {
      const validUrl = 'https://validlink.com';
      const mockReq = {
        body: {
          blogUrl: validUrl,
        },
      };
      const mockRes = {};
      const mockNextFunction = jest.fn();
      checkValidUrl(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      done();
    });
  });

  describe('Test checkValidBlogPage middleware', () => {
    it('should return 400 if the blog page responds with code other than 200', (done) => {
      const invalidBlogPage = 'https://notexistblogpage.com/';

      nock(invalidBlogPage).get('/').reply(404);

      request(app).post('/').send({ blogUrl: invalidBlogPage }).expect(400, done);
    });

    it('should return 400 if the blog page responds with content type other than text/html', (done) => {
      const invalidBlogPage = 'https://nothtmlresponse.com/';

      nock(invalidBlogPage).get('/').reply(200, null, {
        'Content-Type': 'text/xml',
      });

      request(app).post('/').send({ blogUrl: invalidBlogPage }).expect(400, done);
    });
  });

  describe('Test discoverFeedUrls middleware', () => {
    it('should return 404 if there is no feed url discovered', (done) => {
      const validUrl = 'https://linkwithnofeedurls.com';
      const mockBody = `
      <html>
        <head></head>
        <body></body>
      </html>
    `;
      const mockReq = {
        body: {
          blogUrl: validUrl,
        },
      };
      const mockRes = {
        locals: {
          document: mockBody,
        },
      };
      const mockNextFunction = jest.fn();
      discoverFeedUrls(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(createError(404, 'No Feed Url Discovered'));
      expect(mockNextFunction).toBeCalledWith(expectedError);
      done();
    });

    it('should call next() if there is any discovered feed url', (done) => {
      const validUrl = 'https://linkwithnofeedurls.com';
      const mockBody = `
      <html>
        <head>
          <link rel="alternate" type="application/rss+xml" href="https://validblog.com/feed"/>
        </head>
        <body></body>
      </html>
    `;
      const mockReq = {
        body: {
          blogUrl: validUrl,
        },
      };
      const mockRes = {
        locals: {
          document: mockBody,
        },
      };
      const mockNextFunction = jest.fn();
      discoverFeedUrls(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(mockRes.locals.feedUrls).toEqual(['https://validblog.com/feed']);
      done();
    });
  });
});
