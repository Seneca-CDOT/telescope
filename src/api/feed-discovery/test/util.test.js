const nock = require('nock');

const {
  isTwitchUrl,
  toTwitchFeedUrl,
  isFeedUrl,
  getBlogBody,
  getFeedUrlType,
  relevantFeedUrl,
  getFeedUrls,
} = require('../src/util');

describe('util.js', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('isTwitchUrl returns true for a Twitch URL', () => {
    expect(isTwitchUrl('https://twitch.tv/thanhcvann')).toBe(true);
  });

  test('isTwitchUrl returns false for a non-Twitch URL', () => {
    expect(isTwitchUrl('https://google.com')).toBe(false);
  });

  test('toTwitchFeedUrl throws if given a non-Twitch URL', () => {
    expect(() => toTwitchFeedUrl('http://google.com')).toThrow();
  });

  test('toTwitchFeedUrl returns proper Atom feed URL for a Twitch URL', () => {
    expect(toTwitchFeedUrl('https://twitch.tv/thanhcvann')).toEqual(
      'http://localhost/v1/rss-bridge/?action=display&bridge=Twitch&channel=thanhcvann&type=all&format=Atom'
    );
  });

  test('isFeedUrl returns true for a feed url', () => {
    const feedUrl = 'https://blog.com/feed/user/';

    [
      'application/xml',
      'application/rss+xml',
      'application/atom+xml',
      'application/x.atom+xml',
      'application/x-atom+xml',
      'application/json',
      'application/json+oembed',
      'application/xml+oembed',
    ].forEach(async (type) => {
      nock(feedUrl).get('/').reply(200, undefined, { 'Content-Type': type });
      expect(await isFeedUrl(feedUrl)).toBe(true);
    });
  });

  test('isFeedUrl returns false when given URL returns a non 200 status', async () => {
    const feedUrl = 'https://blog.com/feed/user/';
    nock(feedUrl).get('/').reply(404, 'Not Found');

    expect(await isFeedUrl(feedUrl)).toBe(false);
  });

  test('isFeedUrl returns false if given URL returns a non feed content type', async () => {
    const feedUrl = 'https://blog.com/user/';
    nock(feedUrl).get('/').reply(200, '<html></html>', { 'Content-Type': 'text/html' });

    expect(await isFeedUrl(feedUrl)).toBe(false);
  });

  test('isFeedUrl returns false if given an invalid URL is given', async () => {
    const feedUrl = 'Not a URL';

    expect(await isFeedUrl(feedUrl)).toBe(false);
  });

  test('getBlogBody returns the expected body for a given URL', async () => {
    const blogUrl = 'https://test321.blogspot.com/';
    const mockBlogUrlResponseBody = `
      <html lang="en">
        <head>
          <link rel="alternate" type="application/rss+xml" href="https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss"/>
        </head>
        <body></body>
      </html>
    `;

    nock(blogUrl).get('/').reply(200, mockBlogUrlResponseBody, {
      'Content-Type': 'text/html',
    });

    const result = await getBlogBody(blogUrl);
    expect(result).toEqual(mockBlogUrlResponseBody);
  });

  test('getBlogBody returns null when the given URL returns a non-200', async () => {
    const blogUrl = 'https://test321.blogspot.com/';
    nock(blogUrl).get('/').reply(404, 'Not Found', {
      'Content-Type': 'text/html',
    });

    const result = await getBlogBody(blogUrl);
    expect(result).toBe(null);
  });

  test('getBlogBody returns null when the given URL returns a something other than HTML', async () => {
    const blogUrl = 'https://test321.blogspot.com/';
    nock(blogUrl).get('/').reply(200, 'Plain Text', {
      'Content-Type': 'text/plain',
    });

    const result = await getBlogBody(blogUrl);
    expect(result).toBe(null);
  });

  test('getFeedUrlType returns `youtube` when a YouTube link is given', () => {
    expect(getFeedUrlType('https://www.youtube.com/whatever')).toBe('youtube');
    expect(getFeedUrlType('https://youtube.com/whatever')).toBe('youtube');
  });

  test('getFeedUrlType returns `twitch` when a Twitch link is given', () => {
    expect(getFeedUrlType('https://twitch.tv/whatever')).toBe('twitch');
  });

  test('getFeedUrlType returns `blog` when any other URL is given', () => {
    expect(getFeedUrlType('https://google.com')).toBe('blog');
    expect(getFeedUrlType('https://example-blog.com/blog?date=today')).toBe('blog');
  });

  test('getFeedUrlType returns `blog` when an invalid URL is given', () => {
    expect(getFeedUrlType('not-valid')).toBe('blog');
  });

  test('relevantFeedUrl returns true for relevant feed URLs', () => {
    [
      'https://test321.com/feed/user',
      'https://test321.workpress.com/feed/',
      'https://test321.blogspot.com/feeds/posts/default',
    ].forEach((feedUrl) => {
      expect(relevantFeedUrl(feedUrl)).toBe(true);
    });
  });

  test('relevantFeedUrl returns false for irrelevant feed URLs', () => {
    [
      'https://test321.workpress.com/comments/feed/',
      'https://public-api.wordpress.com/oembed/?format=json&url=https%3A%2F%2Ftest321.wordpress.com%2F&for=wpcom-auto-discovery',
      'https://www.blogger.com/feeds/123/posts/default',
      'https://test321.blogspot.com/feeds/posts/default?alt=rss',
    ].forEach((feedUrl) => {
      expect(relevantFeedUrl(feedUrl)).toBe(false);
    });
  });

  test('getFeedUrls returns expected atom+xml feed URL for a given document', () => {
    const html = (type) => `
      <html lang="en">
        <head>
          <link rel="alternate" type="${type}" href="https://test321.blogspot.com/feeds/posts/default/-/open-source"/>
        </head>
        <body></body>
      </html>
    `;

    [
      'application/rss+xml',
      'application/atom+xml',
      'application/x.atom+xml',
      'application/x-atom+xml',
      'application/json',
      'application/json+oembed',
      'application/xml+oembed',
    ].forEach((type) => {
      expect(getFeedUrls(html(type))).toEqual([
        {
          feedUrl: 'https://test321.blogspot.com/feeds/posts/default/-/open-source',
          type: 'blog',
        },
      ]);
    });
  });

  test('getFeedUrls returns null if document cannot be parsed', () => {
    expect(getFeedUrls(null)).toBe(null);
  });

  test('getFeedUrls filters irrelevant feed URLs', () => {
    const html = `
    <html lang="en">
      <head>
        <link rel="alternate" type="application/atom+xml" href="https://test321.blogspot.com/feeds/posts/default" />
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

    const expectedFeedUrls = [
      'https://test321.blogspot.com/feeds/posts/default',
      'https://test321.wordpress.com/feed/',
      'https://medium.com/feed/@test321',
      'https://dev.to/feed/test321',
    ].map((feedUrl) => ({ feedUrl, type: 'blog' }));

    expect(getFeedUrls(html)).toEqual(expectedFeedUrls);
  });
});
