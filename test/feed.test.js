const normalizeUrl = require('normalize-url');

const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

const urlToId = url => hash(normalizeUrl(url));

describe('Fost data class tests', () => {
  const data = {
    author: 'Post Author',
    url: 'https://user.feed.com/feed.rss',
    id: urlToId('https://user.feed.com/feed.rss'),
  };

  const createFeed = () => new Feed(data.author, data.url);

  test('Feed should be a function', () => {
    expect(typeof Feed).toBe('function');
  });

  test('Feed constructor should populate all expected properties', () => {
    expect(createFeed()).toEqual(data);
  });

  test('Feed constructor should throw if missing url', () => {
    expect(() => new Feed('author', undefined)).toThrow();
  });

  test('Feed constructor should throw if missing author and url', () => {
    expect(() => new Feed(undefined, undefined)).toThrow();
  });

  describe('Get and Set Feed objects from database', () => {
    beforeAll(() => createFeed().save());

    test('Feed.byId() for a valid id should return a Feed', async () => {
      const feed = await Feed.byId(data.id);
      expect(feed instanceof Feed).toBe(true);
      expect(feed.author).toEqual(data.author);
      expect(feed.url).toEqual(data.url);
      expect(feed.id).toEqual(data.id);
    });

    test('Feed.byId() for an invalid id should return null', async () => {
      const feed = await Feed.byId('invalid id');
      expect(feed).toBe(null);
    });

    test('Feed.byUrl() for a valid url should return a Feed', async () => {
      const feed = await Feed.byUrl(data.url);
      expect(feed instanceof Feed).toBe(true);
      expect(feed.author).toEqual(data.author);
      expect(feed.url).toEqual(data.url);
      expect(feed.id).toEqual(data.id);
    });

    test('Feed.byId() for an invalid url should return null', async () => {
      const feed = await Feed.byUrl('http://invalid.url.com');
      expect(feed).toBe(null);
    });

    test('Setting etag on a feed should persist', async () => {
      const feed = new Feed('author', 'http://url.com/with/etag');
      feed.etag = 'etag';
      await feed.save();
      const persisted = await Feed.byId(feed.id);
      expect(persisted.etag).toEqual('etag');
      expect(persisted.lastModified).toBe(null);
    });

    test('Setting lastModified on a feed should persist', async () => {
      const feed = new Feed('author', 'http://url.com/with/lastModified');
      feed.lastModified = 'lastModified';
      await feed.save();
      const persisted = await Feed.byId(feed.id);
      expect(persisted.lastModified).toEqual('lastModified');
      expect(persisted.etag).toBe(null);
    });
  });
});
