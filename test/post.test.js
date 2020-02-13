const { parse } = require('feedparser-promised');

const { nockRealWorldRssResponse, getRealWorldRssUri } = require('./fixtures');
const Post = require('../src/backend/data/post');
const hash = require('../src/backend/data/hash');

describe('Post data class tests', () => {
  const text = 'post text';

  const data = {
    title: 'Post Title',
    html: '<p>post text</p>',
    published: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    updated: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    url: 'https://user.post.com/?post-id=123',
    guid: 'https://user.post.com/?post-id=123&guid',
    id: hash('https://user.post.com/?post-id=123&guid'),
    feed: 'fake-feed-id',
  };

  const createPost = () =>
    new Post(data.title, data.html, data.published, data.updated, data.url, data.guid, data.feed);

  test('Post should be a function', () => {
    expect(typeof Post).toBe('function');
  });

  test('Post constructor should populate all expected properties', () => {
    expect(createPost()).toEqual(data);
  });

  test('Post.parse() should be able to parse an Object into a Post', () => {
    expect(Post.parse(data)).toEqual(createPost());
  });

  test('Posts should have a (dynamic) text property', () => {
    const post1 = Post.parse(data);
    const post2 = createPost();

    expect(post1.text).toEqual(text);
    expect(post2.text).toEqual(text);
  });

  test('Post.parse() should work with missing fields', () => {
    const missingData = { ...data, updated: null };
    const post = createPost();
    post.updated = null;

    // Make sure that updated was turned into a date
    const parsed = Post.parse(missingData);
    expect(parsed.updated instanceof Date).toBe(true);

    // Rip it off again and compare to original data
    parsed.updated = null;
    expect(parsed).toEqual(post);
  });

  test('Post.save() and Post.byId() should both work as expected', async () => {
    const post = createPost();
    await post.save();
    const result = await Post.byId(data.id);
    expect(result).toEqual(post);
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
      expect(() => Post.fromArticle(null)).toThrow();
      expect(() => Post.fromArticle()).toThrow();
    });

    test('Post.fromArticle() should work with real world RSS', () => {
      const article = articles[0];
      const post = Post.fromArticle(article, 'feed-id');

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
      expect(post.feed).toEqual('feed-id');
    });

    test('Post.fromArticle() with missing description should throw', () => {
      const article = articles[0];
      delete article.description;
      expect(() => Post.fromArticle(article)).toThrow();
    });

    test('Post.fromArticle() with missing pubdate should not throw', () => {
      const article = articles[0];
      delete article.pubdate;
      expect(() => Post.fromArticle(article)).not.toThrow();
    });

    test('Post.fromArticle() with missing date should not throw', () => {
      const article = articles[0];
      delete article.date;
      expect(() => Post.fromArticle(article)).not.toThrow();
    });

    test('Post.fromArticle() with missing link should throw', () => {
      const article = articles[0];
      delete article.link;
      expect(() => Post.fromArticle(article)).toThrow();
    });

    test('Post.fromArticle() with missing guid should throw', () => {
      const article = articles[0];
      delete article.guid;
      expect(() => Post.fromArticle(article)).toThrow();
    });

    test('Post.fromArticle() with missing title should use Untitled', () => {
      const article = articles[0];
      delete article.title;
      const post = Post.fromArticle(article);
      expect(post.title).toEqual('Untitled');
    });
  });
});
