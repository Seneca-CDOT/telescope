const { parse } = require('feedparser-promised');

const { nockRealWorldRssResponse, getRealWorldRssUri } = require('./fixtures');
const Post = require('../src/backend/data/post');
const Feed = require('../src/backend/data/feed');
const hash = require('../src/backend/data/hash');

describe('Post data class tests', () => {
  let feed;

  const data = {
    title: 'Post Title',
    html: '<p>post text</p>',
    published: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    updated: new Date('Thu, 20 Nov 2014 18:59:18 UTC'),
    url: 'https://user.post.com/?post-id=123',
    guid: 'https://user.post.com/?post-id=123&guid',
    id: hash('https://user.post.com/?post-id=123&guid'),
  };

  beforeAll(async () => {
    const id = await Feed.create({
      author: 'Feed Author',
      url: 'http://feed-url.com/',
    });
    feed = await Feed.byId(id);

    // Set the feed property for our data to this feed
    data.feed = feed;
  });

  const text = 'post text';

  const createPost = () =>
    new Post(data.title, data.html, data.published, data.updated, data.url, data.guid, feed);

  test('Post should be a function', () => {
    expect(typeof Post).toBe('function');
  });

  test('Post constructor should populate all expected properties', () => {
    const post = createPost();
    expect(post.id).toEqual(data.id);
    expect(post.title).toEqual(data.title);
    expect(post.html).toEqual(data.html);
    expect(post.published).toEqual(data.published);
    expect(post.updated).toEqual(data.updated);
    expect(post.guid).toEqual(data.guid);
    expect(post.feed).toEqual(feed);
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

  test('Post.create() should be able to parse an Object into a Post', async () => {
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
    const missingData = { ...data, updated: null, feed };

    // Make sure that updated was turned into a date
    const id = await Post.create(missingData);
    const parsed = await Post.byId(id);
    expect(parsed.updated).toBeDefined();
    expect(typeof parsed.updated.getTime).toEqual('function');
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

  describe('Post.createFromArticle() tests', () => {
    let articles;
    beforeEach(async () => {
      nockRealWorldRssResponse();
      articles = await parse(getRealWorldRssUri());
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(15);
    });

    test('should throw if passed no article', async () => {
      let err;
      try {
        await Post.createFromArticle(null, feed);
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
    });

    test('should throw if passed nothing', async () => {
      let err;
      try {
        await Post.createFromArticle();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
    });

    test('should work with real world RSS', async () => {
      const article = articles[0];
      const id = await Post.createFromArticle(article, feed);
      const post = await Post.byId(id);

      expect(post instanceof Post).toBe(true);
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

    test('when missing description should throw', async () => {
      const article = articles[0];
      delete article.description;
      await expect(Post.createFromArticle(article, feed)).rejects.toThrow();
    });

    test('Post.createFromArticle() with missing pubdate should not throw', async () => {
      const article = articles[0];
      delete article.pubdate;
      const id = await Post.createFromArticle(article, feed);
      expect(typeof id).toEqual('string');
    });

    test('Post.createFromArticle() with missing date should not throw', async () => {
      const article = articles[0];
      delete article.date;
      const id = await Post.createFromArticle(article, feed);
      const post = await Post.byId(id);
      expect(post.published).toBeDefined();
      expect(typeof post.published.getTime).toEqual('function');
    });

    test('Post.createFromArticle() with missing link should throw', async () => {
      const article = articles[0];
      delete article.link;

      let err;
      try {
        await Post.createFromArticle(article, feed);
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
    });

    test('Post.createFromArticle() with missing guid should throw', async () => {
      const article = articles[0];
      delete article.guid;
      await expect(Post.createFromArticle(article, feed)).rejects.toThrow();
    });

    test('Post.createFromArticle() with missing title should use Untitled', async () => {
      const article = articles[0];
      delete article.title;
      const id = await Post.createFromArticle(article, feed);
      const post = await Post.byId(id);
      expect(post.title).toEqual('Untitled');
    });
  });
});
