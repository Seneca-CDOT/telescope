const { redis } = require('../lib/redis');

// Redis Keys
const FEED_ID = 'feed_id';
const FEEDS = 'feeds';

const POSTS = 'posts';

module.exports = {
  addFeed: async (name, url) => {
    // "If the key does not exist, it is set to 0 before performing the operation"
    // https://redis.io/commands/INCR
    const feedId = await redis.incr(FEED_ID);
    await redis
      .multi()
      // Using hmset() until hset() fully supports multiple fields:
      // https://github.com/stipsan/ioredis-mock/issues/345
      // https://github.com/luin/ioredis/issues/551
      .hmset(feedId, 'name', name, 'url', url)
      .sadd(FEEDS, feedId)
      .exec();
    return feedId;
  },

  getFeeds: () => redis.smembers(FEEDS),

  getFeed: feedID => redis.hgetall(feedID),

  getFeedsCount: () => redis.scard(FEEDS),

  addPost: async post => {
    await redis
      .multi()
      .hmset(
        // using guid as keys as it is unique to posts
        post.guid,
        'guid',
        post.guid,
        'author',
        post.author,
        'title',
        post.title,
        'link',
        post.link,
        'content',
        post.content,
        'text',
        post.text,
        'updated',
        post.updated,
        'published',
        post.published,
        'url',
        post.url,
        'site',
        post.site
      )
      .zadd(POSTS, post.published.getTime(), post.guid) // sort set by published date as scores
      .exec();
  },

  /**
   * Gets an array of guids from redis
   * @param from lower index
   * @param to higher index, it needs -1 because redis includes the element at this index in the returned array
   * @return Array of guids
   */
  getPosts: (from, to) => redis.zrevrange(POSTS, from, to - 1),

  getPostsCount: () => redis.zcard(POSTS),

  getPost: async guid => redis.hgetall(guid),
};
