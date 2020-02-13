const { parse } = require('feedparser-promised');

const { nockRealWorldRssResponse, getRealWorldRssUri } = require('./fixtures');
const Post = require('../src/backend/data/post');
const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

describe('Post data class tests', () => {
  const text = 'post text';

  const feed = new Feed('feed-author', 'http://feed-url.com/rss');

  const data = {
    title: 'Post Title',
    html: '<p>post text</p>',
    published: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    updated: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    url: 'https://user.post.com/?post-id=123',
    guid: 'https://user.post.com/?post-id=123&guid',
    id: hash('https://user.post.com/?post-id=123&guid'),
    feed,
  };

  const createPost = () =>
    new Post(data.title, data.html, data.published, data.updated, data.url, data.guid, feed);

  test('Post should be a function', () => {
    expect(typeof Post).toBe('function');
  });

  test('Post constructor should populate all expected properties', () => {
    expect(createPost()).toEqual(data);
  });

  test('Post constructor should work with with published and updated as Strings', () => {
    const post1 = createPost();
    const post2 = new Post(
      data.title,
      data.html,
      'Thu, 20 Nov 2014 18:59:18 UTC',
      'Thu, 20 Nov 2014 18:59:18 UTC',
      data.url,
      data.guid,
      feed
    );

    expect(post1).toEqual(post2);
  });

  test('Post constructor should work with with published and updated as Dates', () => {
    const post1 = createPost();
    const post2 = new Post(
      data.title,
      data.html,
      new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
      new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
      data.url,
      data.guid,
      feed
    );

    expect(post1).toEqual(post2);
  });

  test('Post constructor should throw if feed is missing or not a Feed instance', () => {
    const createPostWithFeed = f =>
      new Post(data.title, data.html, data.published, data.updated, data.url, data.guid, f);

    expect(() => createPostWithFeed(null)).toThrow();
    expect(() => createPostWithFeed(undefined)).toThrow();
    expect(() => createPostWithFeed('feedid')).toThrow();
    expect(() => createPostWithFeed(1234)).toThrow();
    expect(() => createPostWithFeed({})).toThrow();
    expect(() => createPostWithFeed(feed)).not.toThrow();
  });

  test.only('Post.create() should be able to parse an Object into a Post', async () => {
    const id = await Post.create(data);
    const expectedId = 'a371654c75';
    expect(id).toEqual(expectedId);
    const post = await Post.byId(expectedId);
    expect(post).toEqual(createPost());
    expect(post.feed instanceof Feed).toBe(true);
  });

  test('Posts should have a (dynamic) text property', async () => {
    const id = await Post.create(data);
    const post = await Post.byId(id);
    expect(post.text).toEqual(text);
  });

  test('Post.create() should work with missing fields', async () => {
    const missingData = { ...data, updated: null };

    // Make sure that updated was turned into a date
    const id = await Post.create(missingData);
    const parsed = await Post.byId(id);
    expect(parsed.updated instanceof Date).toBe(true);
  });

  test('Post.save() and Post.byId() should both work as expected', async () => {
    const id = await Post.create(data);
    const post = await Post.byId(id);
    expect(post).toEqual(data);

    // Modify the post and save
    post.title = 'updated title';
    await post.save();

    // Get it back again
    const post2 = await Post.byId(id);
    const data2 = { ...data, title: 'updated title' };
    expect(post2).toEqual(data2);
  });

  test('Post.byId() with invalid id should return null', async () => {
    const post = createPost();
    await post.save();
    const result = await Post.byId('invalid id');
    expect(result).toBe(null);
  });

  describe('Post.fromArticle() tests', () => {
    let articles;
    beforeEach(async () => {
      nockRealWorldRssResponse();
      articles = await parse(getRealWorldRssUri());
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(15);
    });

    test('Post.fromArticle() should throw if passed nothing', () => {
      expect(() => Post.fromArticle(null, feed)).toThrow();
      expect(() => Post.fromArticle()).toThrow();
    });

    test('Post.fromArticle() should work with real world RSS', () => {
      const article = articles[0];
      const post = Post.fromArticle(article, feed);

      expect(post.title).toEqual('Teaching Open Source, Fall 2019');
      expect(
        post.html.startsWith(`<p>Today I've completed another semester of teaching open source`)
      ).toBe(true);
      expect(post.text.startsWith("Today I've completed another semester of teaching open source"));
      expect(post.published).toEqual(new Date('Mon, 16 Dec 2019 20:37:14 GMT'));
      expect(post.updated).toEqual(new Date('Mon, 16 Dec 2019 20:37:14 GMT'));
      expect(post.url).toEqual('https://blog.humphd.org/open-source-fall-2019/');
      expect(post.guid).toEqual('5df7bbd924511e03496b4734');
      expect(post.id).toEqual(hash(post.guid));
      expect(post.feed).toEqual(feed);
    });

    test('Post.fromArticle() with missing description should throw', () => {
      const article = articles[0];
      delete article.description;
      expect(() => Post.fromArticle(article, feed)).toThrow();
    });

    test('Post.fromArticle() with missing pubdate should not throw', () => {
      const article = articles[0];
      delete article.pubdate;
      expect(() => Post.fromArticle(article, feed)).not.toThrow();
    });

    test('Post.fromArticle() with missing date should not throw', () => {
      const article = articles[0];
      delete article.date;
      expect(() => Post.fromArticle(article, feed)).not.toThrow();
    });

    test('Post.fromArticle() with missing link should throw', () => {
      const article = articles[0];
      delete article.link;
      expect(() => Post.fromArticle(article, feed)).toThrow();
    });

    test('Post.fromArticle() with missing guid should throw', () => {
      const article = articles[0];
      delete article.guid;
      expect(() => Post.fromArticle(article, feed)).toThrow();
    });

    test('Post.fromArticle() with missing title should use Untitled', () => {
      const article = articles[0];
      delete article.title;
      const post = Post.fromArticle(article, feed);
      expect(post.title).toEqual('Untitled');
    });
  });
});
