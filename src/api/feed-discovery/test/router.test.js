const request = require('supertest');
const nock = require('nock');
const { createServiceToken } = require('@senecacdot/satellite');

const { app } = require('../src');

describe('POST /', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('Test the API returns feed URLs correctly', () => {
    it('should return 200 and 1 rss+xml feed url if there is one link of type="application/rss+xml"', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/rss+xml" href="https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss"/>
          </head>
          <body></body>
        </html>
      `;

      const result = {
        feedUrls: ['https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss'],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send({ blogUrl });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and 1 atom+xml feed url if there is 1 link of type="application/atom+xml"', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/atom+xml" href="https://test321.blogspot.com/feeds/posts/default/-/open-source"/>
          </head>
          <body></body>
        </html>
      `;

      const result = {
        feedUrls: ['https://test321.blogspot.com/feeds/posts/default/-/open-source'],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send({ blogUrl });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and 1 json+oembed feed url if there is 1 link of type="application/json+oembed"', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/atom+xml" href="https://test321.blogspot.com/oembed/?format=json"/>
          </head>
          <body></body>
        </html>
      `;

      const result = {
        feedUrls: ['https://test321.blogspot.com/oembed/?format=json'],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send({ blogUrl });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and 1 xml+oembed feed url if there is 1 link of type="application/xml+oembed"', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/xml+oembed" href="https://test321.blogspot.com/oembed/?format=xml"/>
          </head>
          <body></body>
        </html>
      `;

      const result = {
        feedUrls: ['https://test321.blogspot.com/oembed/?format=xml'],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send({ blogUrl });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and all feed urls if there are multiple link elements that could contain a feed url', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
          <!doctype html>
          <html lang="en">
            <head>
              <link rel="alternate" type="application/x.atom+xml" href="https://test321.blogspot.com/x.atom/feeds/posts/default/-/open-source"/>
              <link rel="alternate" type="application/x-atom+xml" href="https://test321.blogspot.com/x-atom/feeds/posts/default/-/open-source"/>
              <link rel="alternate" type="application/json" href="https://test321.blogspot.com/json"/>
              <link rel="alternate" type="application/json+oembed" href="https://test321.blogspot.com/oembed/?format=json"/>
              <link rel="alternate" type="application/xml+oembed" href="https://test321.blogspot.com/oembed/?format=xml"/>
            </head>
            <body></body>
          </html>
        `;

      const result = {
        feedUrls: [
          'https://test321.blogspot.com/x.atom/feeds/posts/default/-/open-source',
          'https://test321.blogspot.com/x-atom/feeds/posts/default/-/open-source',
          'https://test321.blogspot.com/json',
          'https://test321.blogspot.com/oembed/?format=json',
          'https://test321.blogspot.com/oembed/?format=xml',
        ],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send({ blogUrl });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 401 if no authorization token is included in headers', async () => {
      const res = await request(app).post('/').send({ blogUrl: 'https://test321.blogspot.com/' });
      expect(res.status).toBe(401);
    });
  });
});
