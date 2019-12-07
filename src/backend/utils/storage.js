const { redis } = require('../lib/redis');

// Redis Keys
const FEED_ID = 'feed_id';
const FEEDS = 'feeds';

const POSTS = 'posts';
const INACTIVE_FEEDS = 'inactive_feeds';

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
      .zadd(POSTS, post.published.getTime(), post.guid)
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

  /**
   * Moves a feed from active(FEEDS) to inactive(INACTIVE_FEEDS)
   * @param feedId lower index
   * @return feedId of feed being moved
   */
  addInactiveFeed: async feedId => {
    if ((await redis.exists(INACTIVE_FEEDS)) === 1) {
      await redis.smove(FEEDS, INACTIVE_FEEDS, feedId);
    } else {
      const name = await redis.hget(feedId, 'name');
      const url = await redis.hget(feedId, 'url');
      await redis
        .multi()
        // Using hmset() until hset() fully supports multiple fields:
        // https://github.com/stipsan/ioredis-mock/issues/345
        // https://github.com/luin/ioredis/issues/551
        .hmset(feedId, 'name', name, 'url', url)
        .sadd(INACTIVE_FEEDS, feedId)
        .exec();
      return feedId;
    }
    return feedId;
  },

  getInactiveFeeds: () => redis.smembers(INACTIVE_FEEDS),

  getInactiveFeed: feedID => redis.hgetall(feedID),

  getInactiveFeedsCount: () => redis.scard(INACTIVE_FEEDS),
};
