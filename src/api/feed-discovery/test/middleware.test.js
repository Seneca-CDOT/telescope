const nock = require('nock');
const { createError } = require('@senecacdot/satellite');

const { checkValidUrl, checkValidBlog, discoverFeedUrls } = require('../src/middleware');

describe('POST /', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('Test checkValidUrl middleware', () => {
    it('should return 400 status if the url has invalid format', () => {
      const invalidUrl = 'invalidlink.com';
      const mockReq = {
        body: {
          blogUrl: invalidUrl,
        },
      };
      const mockRes = {};
      const mockNextFunction = jest.fn();
      const middleware = checkValidUrl();
      middleware(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(400, 'Invalid Blog URL');

      // Expect the next() function to be called with the expected error
      expect(mockNextFunction).toBeCalledWith(expectedError);
    });

    it('should call next() if the url has valid format', () => {
      const validUrl = 'https://validlink.com';
      const mockReq = {
        body: {
          blogUrl: validUrl,
        },
      };
      const mockRes = {};
      const mockNextFunction = jest.fn();
      const middleware = checkValidUrl();
      middleware(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test checkValidBlog middleware', () => {
    it('should return 200 if the blog page responds with 200', async () => {
      const validBlogUrl = 'https://existblogpage.com/';
      const mockBody = '<p>ok</p>';
      nock(validBlogUrl).get('/').reply(200, mockBody, {
        'Content-Type': 'text/html',
      });

      const mockReq = {
        body: {
          blogUrl: validBlogUrl,
        },
      };
      const mockRes = {
        locals: {},
      };
      const mockNextFunction = jest.fn();

      nock(validBlogUrl).get('/').reply(200, mockBody, {
        'Content-Type': 'text/html',
      });

      const middleware = checkValidBlog();
      await middleware(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(mockRes.locals.document).toEqual(mockBody);
    });

    it('should return 400 if the blog page responds with code other than 200', async () => {
      const invalidBlogUrl = 'https://notexistblogpage.com/';
      nock(invalidBlogUrl).get('/').reply(404);

      const mockReq = {
        body: {
          blogUrl: invalidBlogUrl,
        },
      };
      const mockRes = {
        locals: {},
      };
      const mockNextFunction = jest.fn();

      const middleware = checkValidBlog();
      await middleware(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(createError(400, 'Unable to Check Blog'));
      expect(mockNextFunction).toBeCalledWith(expectedError);
    });

    it('should return 400 if the blog page responds with content type other than text/html', async () => {
      const invalidBlogUrl = 'https://nothtmlresponse.com/';
      nock(invalidBlogUrl).get('/').reply(200, null, {
        'Content-Type': 'text/xml',
      });

      const mockReq = {
        body: {
          blogUrl: invalidBlogUrl,
        },
      };
      const mockRes = {
        locals: {},
      };
      const mockNextFunction = jest.fn();

      const middleware = checkValidBlog();
      await middleware(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      const expectedError = createError(createError(400, 'Invalid Blog'));
      expect(mockNextFunction).toBeCalledWith(expectedError);
    });
  });

  describe('Test discoverFeedUrls middleware', () => {
    it('should return 400 if the blog is unparsable', () => {
      const validUrl = 'https://linkwithnofeedurls.com';
      const mockBody = null;

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
      const middleware = discoverFeedUrls();
      middleware(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(createError(400, 'Invalid Blog'));
      expect(mockNextFunction).toBeCalledWith(expectedError);
    });

    it('should return 404 if there is no feed url discovered', () => {
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
      const middleware = discoverFeedUrls();
      middleware(mockReq, mockRes, mockNextFunction);
      const expectedError = createError(createError(404, 'No Feed Url Discovered'));
      expect(mockNextFunction).toBeCalledWith(expectedError);
    });

    it('should call next() if there is any discovered feed url', () => {
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
      const middleware = discoverFeedUrls();
      middleware(mockReq, mockRes, mockNextFunction);
      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(mockRes.locals.feedUrls).toEqual(['https://validblog.com/feed']);
    });
  });
});
