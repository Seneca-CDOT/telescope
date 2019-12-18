const { redis } = require('../lib/redis');

// Redis Keys
const FEED_ID = 'feed_id';
const FEEDS = 'feeds';

const POSTS = 'posts';
const INACTIVE_FEEDS = 'inactive_feeds';

module.exports = {
  /**
   * Adds/Moves feed to the active FEEDS set and returns the feedId
   * @param feed Feed Object
   * @return feedId
   */
  addFeed: async feed => {
    if (feed.feedId && (await redis.exists(INACTIVE_FEEDS)) === 1) {
      await redis.smove(INACTIVE_FEEDS, FEEDS, feed.feedId);
    } else {
      // "If the key does not exist, it is set to 0 before performing the operation"
      // https://redis.io/commands/INCR
      const feedId = await redis.incr(FEED_ID);
      await redis
        .multi()
        // Using hmset() until hset() fully supports multiple fields:
        // https://github.com/stipsan/ioredis-mock/issues/345
        // https://github.com/luin/ioredis/issues/551
        .hmset(feedId, 'name', feed.name, 'url', feed.url)
        .sadd(FEEDS, feedId)
        .exec();
      return feedId;
    }
    return feed.feedId;
  },

  /**
   * Moves feed from active FEEDS set to INACTIVE_FEEDS set. A destination must always be initialized
   * with sadd() before other members can be moved to the destination
   * @param feed Feed Object
   */
  addInactiveFeed: async feed => {
    if ((await redis.exists(INACTIVE_FEEDS)) === 1) {
      await redis.smove(FEEDS, INACTIVE_FEEDS, feed.feedId);
    } else {
      await redis
        .multi()
        // Using hmset() until hset() fully supports multiple fields:
        // https://github.com/stipsan/ioredis-mock/issues/345
        // https://github.com/luin/ioredis/issues/551
        .hmset(feed.feedId, 'name', feed.name, 'url', feed.url)
        .sadd(INACTIVE_FEEDS, feed.feedId)
        .exec();
    }
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

  getInactiveFeeds: () => redis.smembers(INACTIVE_FEEDS),

  getInactiveFeedsCount: () => redis.scard(INACTIVE_FEEDS),

  getFeedStatus: feedId => redis.sismember(FEEDS, feedId),
};
