const { redis } = require('../lib/redis');

// Redis Keys
const feedsKey = 't:feeds';
const postsKey = 't:posts';

// Namespaces
const feedNamespace = 't:feed:';
const postNamespace = 't:post:';

// "6Xoj0UXOW3" to "t:post:6Xoj0UXOW3"
const createPostKey = id => postNamespace.concat(id);
// "NirlSYranl" to "t:feed:NirlSYranl"
const createFeedKey = id => feedNamespace.concat(id);

module.exports = {
  /**
   * Feeds
   */
  addFeed: async feed => {
    const key = createFeedKey(feed.id);
    await redis
      .multi()
      // Using hmset() until hset() fully supports multiple fields:
      // https://github.com/stipsan/ioredis-mock/issues/345
      // https://github.com/luin/ioredis/issues/551
      .hmset(key, 'id', feed.id, 'author', feed.author, 'url', feed.url)
      .sadd(feedsKey, feed.id)
      .exec();
  },

  getFeeds: () => redis.smembers(feedsKey),

  getFeed: id => redis.hgetall(feedNamespace.concat(id)),

  getFeedsCount: () => redis.scard(feedsKey),

  /**
   * Posts
   */
  addPost: async post => {
    const key = createPostKey(post.id);
    await redis
      .multi()
      .hmset(
        key,
        'id',
        post.id,
        'author',
        post.author,
        'title',
        post.title,
        'html',
        post.html,
        'text',
        post.text,
        'published',
        post.published,
        'updated',
        post.updated,
        'url',
        post.url,
        'site',
        post.site,
        'guid',
        post.guid
      )
      // sort set by published date as scores
      .zadd(postsKey, post.published.getTime(), post.id)
      .exec();
  },

  /**
   * Returns an array of post ids from redis
   * @param from lower index
   * @param to higher index, it needs -1 because redis includes the element at this index in the returned array
   * @return Array of ids
   */
  getPosts: (from, to) => redis.zrevrange(postsKey, from, to - 1),

  getPostsCount: () => redis.zcard(postsKey),

  getPost: id => redis.hgetall(postNamespace.concat(id)),
};
