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
    });

    test('Setting lastModified on a feed should persist', async () => {
      const feed = new Feed('author', 'http://url.com/with/lastModified');
      feed.lastModified = 'lastModified';
      await feed.save();
      const persisted = await Feed.byId(feed.id);
      expect(persisted.lastModified).toEqual('lastModified');
      expect(persisted.etag).toBe(null);
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
  });
});
