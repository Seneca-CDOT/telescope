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
        feedUrls: [
          {
            feedUrl: 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss',
            type: 'blog',
          },
        ],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and 2 rss+xml feed urls if there are two valid blogs', async () => {
      // First blog
      const blogUrl1 = 'https://test321.blogspot.com/';
      const mockBlogUrl1ResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/rss+xml" href="https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss"/>
          </head>
          <body></body>
        </html>
      `;

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl1).get('/').twice().reply(200, mockBlogUrl1ResponseBody, {
        'Content-Type': 'text/html',
      });

      // Second blog
      const blogUrl2 = 'https://test456.blogspot.com/';
      const mockBlogUrl2ResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/rss+xml" href="https://test456.blogspot.com/feeds/posts/default/-/open-source?alt=rss"/>
          </head>
          <body></body>
        </html>
      `;

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl2).get('/').twice().reply(200, mockBlogUrl2ResponseBody, {
        'Content-Type': 'text/html',
      });

      const result = {
        feedUrls: [
          {
            feedUrl: 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss',
            type: 'blog',
          },
          {
            feedUrl: 'https://test456.blogspot.com/feeds/posts/default/-/open-source?alt=rss',
            type: 'blog',
          },
        ],
      };

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl1, blogUrl2]);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return a 400 if the url is not valid', async () => {
      const invalidUrl = 'invalidlink.com';

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([invalidUrl]);
      expect(res.status).toBe(400);
    });

    it('should return 400 if the blog body is not parsable', async () => {
      const blogUrl = 'https://test321.blogspot.com/';

      // Mocking the response body html (send back nothing) when call GET request to blog url
      nock(blogUrl).get('/').reply(200, undefined, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(400);
    });

    it('should return 404 if the blog body does not contain any feed URLs', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogBody = `
      <html>
      <head></head>
      <body></body>
      </html>`;

      // Mocking the response body html (send back nothing) when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(404);
    });

    it('should return 400 if the blog does not respond with a 200', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogBody = `
      <html>
      <head></head>
      <body>Not Found</body>
      </html>`;

      // Mocking the response body html (send back nothing) when call GET request to blog url
      nock(blogUrl).get('/').reply(404, mockBlogBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(400);
    });

    it('should return 400 if the blog does not respond with a 200', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogBody = 'plain text response';

      // Mocking the response body html (send back nothing) when call GET request to blog url
      nock(blogUrl).get('/').reply(200, mockBlogBody, {
        'Content-Type': 'text/plain',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(400);
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
        feedUrls: [
          {
            feedUrl: 'https://test321.blogspot.com/feeds/posts/default/-/open-source',
            type: 'blog',
          },
        ],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
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
        feedUrls: [{ feedUrl: 'https://test321.blogspot.com/oembed/?format=json', type: 'blog' }],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
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
        feedUrls: [{ feedUrl: 'https://test321.blogspot.com/oembed/?format=xml', type: 'blog' }],
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and all relevant feed urls if there are multiple link elements that could contain a feed url', async () => {
      const blogUrl = 'https://test321.blogspot.com/';
      const mockBlogUrlResponseBody = `
          <!doctype html>
          <html lang="en">
            <head>
              <link rel="alternate" type="application/x.atom+xml" href="https://test321.blogspot.com/x.atom/feeds/posts/default/-/open-source" />
              <link rel="alternate" type="application/x-atom+xml" href="https://test321.blogspot.com/x-atom/feeds/posts/default/-/open-source" />
              <link rel="alternate" type="application/json" href="https://test321.blogspot.com/json" />
              <link rel="alternate" type="application/json+oembed" href="https://test321.blogspot.com/oembed/?format=json" />
              <link rel="alternate" type="application/xml+oembed" href="https://test321.blogspot.com/oembed/?format=xml" />
              <link rel="alternate" type="application/rss+xml" href="https://test321.blogspot.com/feeds/posts/default" />
              <link rel="alternate" type="application/rss+xml" href="https://test321.blogspot.com/feeds/posts/default?alt=rss" />
              <link rel="alternate" type="application/atom+xml" href="https://www.blogger.com/feeds/123/posts/default" />
              <link rel="alternate" type="application/rss+xml" href="https://test321.wordpress.com/feed/" />
              <link rel="alternate" type="application/rss+xml" href="https://test321.wordpress.com/comments/feed/" />
              <link rel="alternate" type="application/json+oembed" href="https://public-api.wordpress.com/oembed/?format=json&url=https%3A%2F%2Ftest321.wordpress.com%2F&for=wpcom-auto-discovery" />
              <link rel="alternate" type="application/rss+xml" href="https://medium.com/feed/@test321" />
              <link rel="alternate" type="application/rss+xml" href="https://dev.to/feed/test321" />
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
          'https://test321.blogspot.com/feeds/posts/default',
          'https://test321.wordpress.com/feed/',
          'https://medium.com/feed/@test321',
          'https://dev.to/feed/test321',
        ].map((feedUrl) => ({ feedUrl, type: 'blog' })),
      };

      // Mocking the response body html when call GET request to blog url
      nock(blogUrl).get('/').twice().reply(200, mockBlogUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([blogUrl]);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 200 and 1 rss+xml feed url if the link is from a YouTube channel', async () => {
      const youTubeDomain = 'https://www.youtube.com';
      const channelUri = '/channel/UCqaMbMDf01BLttof1lHAo2A';
      const youTubeChannelUrl = `${youTubeDomain}${channelUri}`;
      const mockYouTubeChannelUrlResponseBody = `
        <html lang="en">
          <head>
            <link rel="alternate" type="application/rss+xml" title="RSS" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCqaMbMDf01BLttof1lHAo2A"/>
          </head>
          <body></body>
        </html>
      `;

      const result = {
        feedUrls: [
          {
            feedUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqaMbMDf01BLttof1lHAo2A',
            type: 'youtube',
          },
        ],
      };

      // Mocking the response body html when call GET request to blog url
      nock(youTubeDomain).get(channelUri).twice().reply(200, mockYouTubeChannelUrlResponseBody, {
        'Content-Type': 'text/html',
      });

      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([youTubeChannelUrl]);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });

    it('should return 401 if no authorization token is included in headers', async () => {
      const res = await request(app).post('/').send(['https://test321.blogspot.com/']);
      expect(res.status).toBe(401);
    });

    it.concurrent.each([
      'application/xml',
      'application/rss+xml',
      'application/atom+xml',
      'application/x.atom+xml',
      'application/x-atom+xml',
      'application/json',
      'application/json+oembed',
      'application/xml+oembed',
    ])('should return 200 and the url when url response content type is %s', async (type) => {
      const feedUrl = 'https://test321.blogspot.com/feed/user/';

      const result = {
        feedUrls: [
          {
            feedUrl,
            type: 'blog',
          },
        ],
      };

      nock(feedUrl).get('/').reply(200, undefined, { 'Content-Type': type });
      const res = await request(app)
        .post('/')
        .set('Authorization', `bearer ${createServiceToken()}`)
        .send([feedUrl]);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(result);
    });
  });

  it('should return 200 and 1 Atom feed url using RSS Bridge if the link is from a Twitch channel', async () => {
    const twitchDomain = 'https://twitch.tv';
    const channelUri = '/thanhcvann';
    const twitchChannelUrl = `${twitchDomain}${channelUri}`;
    const mockYouTubeChannelUrlResponseBody = `
      <html lang="en">
        <body>Twitch</body>
      </html>
    `;

    const twitchFeedDomain = process.env.RSS_BRIDGE_URL;
    const twitchFeedUri = '/?action=display&bridge=Twitch&channel=thanhcvann&type=all&format=Atom';
    const twitchFeedUrl = `${twitchFeedDomain}${twitchFeedUri}`;
    const mockTwitchChannelUrlResponseBody = `
      <html lang="en">
        <body>Twitch</body>
      </html>
    `;

    const result = {
      feedUrls: [
        {
          feedUrl: twitchFeedUrl,
          type: 'twitch',
        },
      ],
    };

    // Mocking the response body html when call GET request to blog url
    nock(twitchDomain).get(channelUri).reply(200, mockYouTubeChannelUrlResponseBody, {
      'Content-Type': 'text/html',
    });

    nock(twitchFeedDomain).get(twitchFeedUri).reply(200, mockTwitchChannelUrlResponseBody, {
      'Content-Type': 'application/atom+xml',
    });

    const res = await request(app)
      .post('/')
      .set('Authorization', `bearer ${createServiceToken()}`)
      .send([twitchChannelUrl]);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(result);
  });
});
