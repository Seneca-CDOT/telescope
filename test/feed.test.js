const normalizeUrl = require('normalize-url');

const Feed = require('../src/backend/data/feed');
const Post = require('../src/backend/data/post');
const Elastic = require('../src/backend/utils/elastic');
const hash = require('../src/backend/data/hash');

const urlToId = (url) => hash(normalizeUrl(url));
jest.mock('../src/backend/utils/elastic');

describe('Post data class tests', () => {
  const data = {
    author: 'Post Author',
    url: 'https://user.feed.com/feed.rss',
    user: 'user',
    id: urlToId('https://user.feed.com/feed.rss'),
    link: 'https://user.feed.com/',
    etag: null,
    lastModified: null,
  };

  const data2 = {
    author: 'Post Author2',
    url: 'https://user2.feed.com/feed.rss',
    user: 'user2',
    link: 'https://user2.feed.com/',
    etag: null,
    lastModified: null,
  };

  const data3 = {
    author: 'Post Author3',
    url: 'https://user3.feed.com/feed.rss',
    user: 'user3',
    link: 'https://user3.feed.com/',
    etag: null,
    lastModified: null,
  };

  const createFeed = () => new Feed(data.author, data.url, data.user, data.link, null, null);

  const articleData1 = {
    guid: 'http://dev.telescope.cdot.systems',
    id: hash('http://dev.telescope.cdot.systems'),
    title: 'fooTitle',
    description: 'fooDescription',
    link: 'fooLink',
    pubdate: 'fooDate',
    length: 'fooLength',
    date: 'fooDate',
  };

  const articleData2 = {
    guid: 'http://example.com',
    id: hash('http://example.com'),
    title: 'dooTitle',
    description: 'dooDescription',
    link: 'dooLink',
    pubdate: 'dooDate',
    length: 'dooLength',
    date: 'dooDate',
  };

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
      expect(feed.link).toEqual(data.link);
      expect(feed.user).toEqual(data.user);
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
      expect(feed.link).toEqual(data.link);
      expect(feed.user).toEqual(data.user);
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
      // Teardown removing the added feed
      await feed.delete();
    });

    test('Setting lastModified on a feed should persist', async () => {
      const feed = new Feed('author', 'http://url.com/with/lastModified');
      feed.lastModified = 'lastModified';
      await feed.save();
      const persisted = await Feed.byId(feed.id);
      expect(persisted.lastModified).toEqual('lastModified');
      expect(persisted.etag).toBe(null);
      // Teardown removing the added feed
      await feed.delete();
    });

    test('Feed.isDelayed() should return true only after Feed.setDelayed() is called', async () => {
      const feed = await Feed.byUrl(data.url);
      expect(feed.isDelayed()).resolves.toBe(false);
      await feed.setDelayed(60);
      expect(feed.isDelayed()).resolves.toBe(true);
    });

    test('Updated feed should be different from data', async () => {
      const feed = new Feed(data.author, data.url, data.user, data.link, null, null);
      feed.author = 'Author Post';
      feed.url = 'https://modified.user.feed.com/feed.rss';
      await feed.update();
      const modifiedFeed = await Feed.byId(feed.id);
      // modifiedFeed.id should be different from feed.id as feed hasn't been reassigned to updated feed.id value
      expect(modifiedFeed.id).not.toBe(feed.id);
      expect(modifiedFeed.id).not.toBe(createFeed.id);
      expect(modifiedFeed.url).not.toBe(createFeed.url);
      expect(modifiedFeed.author).not.toBe(createFeed.author);
      expect(modifiedFeed.url).toBe(feed.url);
      expect(modifiedFeed.author).toBe(feed.author);
      expect(modifiedFeed.id).toBe(urlToId(feed.url));
      // Teardown removing the added feed
      await feed.delete();
    });

    test('Removing feeds should also remove posts', async () => {
      const feed = await Feed.byId(await Feed.create(data));

      await Promise.all([
        Post.createFromArticle(articleData1, feed),
        Post.createFromArticle(articleData2, feed),
      ]);

      const posts = await Promise.all([Post.byId(articleData1.id), Post.byId(articleData2.id)]);
      const elasticPosts = await Elastic.search();

      // Make sure our feed is correct and saved
      expect(feed.id).toBe(data.id);
      // Make sure our posts actually have data and is the same as PostData1 + PostData2
      expect(posts[0].id).toBe(articleData1.id);
      expect(posts[1].id).toBe(articleData2.id);
      expect(posts[0].feed.id).toBe(feed.id);
      expect(posts[1].feed.id).toBe(feed.id);
      expect(posts[0].feed.author).toBe(feed.author);
      expect(posts[1].feed.author).toBe(feed.author);
      // Testing Posts in ElasticSearch here
      expect(elasticPosts.results).toBe(posts.length);
      // Check whether stored text in elasticSearch is same as Post description
      expect(elasticPosts.values[0].text).toBe(articleData1.description);
      expect(elasticPosts.values[1].text).toBe(articleData2.description);
      await feed.delete();
      const esSearchDelete = await Elastic.search();

      // Make sure posts are removed as well
      const removedFeed = await Feed.byId(feed.id);
      const removedPosts = await Promise.all([
        Post.byId(articleData1.id),
        Post.byId(articleData2.id),
      ]);
      expect(removedFeed).toBe(null);
      expect(removedPosts[0]).toBe(null);
      expect(esSearchDelete.values).toStrictEqual([]);
      expect(esSearchDelete.results).toBe(0);
    });

    test('clearCache should set lastModified and etag to null', async () => {
      let feed = new Feed(data.author, data.url, data.user, data.link, 'etag', 'lastModified');
      let feed2 = new Feed(data2.author, data2.url, data2.user, data2.link, 'etag', 'lastModified');
      let feed3 = new Feed(data3.author, data3.url, data3.user, data3.link, 'etag', 'lastModified');

      feed = await Feed.byId(await Feed.create(feed));
      feed2 = await Feed.byId(await Feed.create(feed2));
      feed3 = await Feed.byId(await Feed.create(feed3));
      // Basic check
      expect(feed.etag).toBe('etag');
      expect(feed.lastModified).toBe('lastModified');
      expect(feed2.etag).toBe('etag');
      expect(feed2.lastModified).toBe('lastModified');
      expect(feed3.etag).toBe('etag');
      expect(feed3.lastModified).toBe('lastModified');

      // Test clearCache()
      await Feed.clearCache();
      const clearedFeed = await Feed.byId(feed.id);
      const clearedFeed2 = await Feed.byId(feed2.id);
      const clearedFeed3 = await Feed.byId(feed3.id);
      expect(clearedFeed.etag).toBe(null);
      expect(clearedFeed.lastModified).toBe(null);
      expect(clearedFeed2.etag).toBe(null);
      expect(clearedFeed2.lastModified).toBe(null);
      expect(clearedFeed3.etag).toBe(null);
      expect(clearedFeed3.lastModified).toBe(null);
      // Teardown removing the added feed
      await Promise.all([await feed.delete(), await feed2.delete(), await feed3.delete()]);
    });

    test('Flagged feed should appear in t:feeds:flagged and not t:feeds', async () => {
      const feedData = new Feed(data.author, data.url, data.user, data.link);
      const feedData2 = new Feed(data2.author, data2.url, data2.user, data2.link);
      const feedData3 = new Feed(data3.author, data3.url, data3.user, data3.link);

      // Check all three feeds are created
      const feed = await Feed.byId(await Feed.create(feedData));
      const feed2 = await Feed.byId(await Feed.create(feedData2));
      const feed3 = await Feed.byId(await Feed.create(feedData3));

      let unFlaggedFeeds = await Feed.all();
      expect(unFlaggedFeeds.length).toBe(3);

      // Test flag()
      await Promise.all([feed.flag(), feed2.flag()]);
      unFlaggedFeeds = await Feed.all();
      expect(unFlaggedFeeds.length).toBe(1);

      let flaggedFeeds = await Feed.flagged();
      expect(flaggedFeeds.length).toBe(2);

      // Feed should not appear in unflagged set if Feed is flagged and added again
      await Feed.create(feedData);
      unFlaggedFeeds = await Feed.all();
      expect(unFlaggedFeeds.length).toBe(1);

      // Flagged feeds should have same data as feed + feed2
      expect(flaggedFeeds.some((flaggedFeed) => flaggedFeed.id === feed.id)).toBe(true);
      expect(flaggedFeeds.some((flaggedFeed) => flaggedFeed.id === feed2.id)).toBe(true);

      // Test unflag();
      await feed2.unflag();
      unFlaggedFeeds = await Feed.all();
      expect(unFlaggedFeeds.length).toBe(2);

      flaggedFeeds = await Feed.flagged();
      expect(flaggedFeeds.length).toBe(1);

      // Testing delete() as part of teardown, feed should be removed from t:feeds:flagged
      await feed.delete();
      flaggedFeeds = await Feed.flagged();
      expect(flaggedFeeds.length).toBe(0);
      await feed2.delete();
      await feed3.delete();

      // Testing whether removing an already removed feed will error
      await feed.delete();
    });
  });
});
