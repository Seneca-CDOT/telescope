const { redis } = require('../lib/redis');

// Redis Keys
const FEED_ID = 'feed_id';
const FEEDS = 'feeds';

const POSTS = 'posts';
const INACTIVE_FEEDS = 'inactive_feeds';

module.exports = {
  /**
   * Adds/Moves feed to the appropriate set depending on feedSet parameter.
   * @param feed Feed Object
   * @return feedId
   */
  addFeed: async feed => {
    // "If the key does not exist, it is set to 0 before performing the operation"
    // https://redis.io/commands/INCR
    const feedId = await redis.incr(FEED_ID);
    // Using hmset() until hset() fully supports multiple fields:
    // https://github.com/stipsan/ioredis-mock/issues/345
    // https://github.com/luin/ioredis/issues/551
    await redis.hmset(feedId, 'name', feed.name, 'url', feed.url);
    return feedId;
  },

  /**
   * Stores feed into destinatiion
   * @param feedId unique ID of feed to be stored
   * @param destination set feed is being added into
   */
  storeFeed: async (feedId, destination) => {
    return redis.sadd(destination, feedId);
  },

  /**
   * Moves feed from source to destination, if the destination does not exist (0 members), will call storeFeed() to destination instead
   * @param feedId unique ID of feed to be moved
   * @param source source of feed bbeing moved from
   * @param destination destination of feed being moved into
   * @return 1 for success, 0 for failure
   */
  moveFeed: async (feedId, source, destination) => {
    let result;
    const members = (await redis.smembers(destination)).length;
    if (members === 0) {
      result = redis.smove(source, destination, feedId);
    } else {
      result = this.storeFeed(feedId, destination);
    }
    return result;
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

  isFeedActive: feedId => redis.sismember(FEEDS, feedId),
};
