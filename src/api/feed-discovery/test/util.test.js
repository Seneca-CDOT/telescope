const nock = require('nock');

const {
  isTwitchUrl,
  toTwitchFeedUrl,
  getBlogBody,
  getFeedUrlType,
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
});
