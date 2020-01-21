const crypto = require('crypto');
const normalizeUrl = require('normalize-url');
const { logger } = require('./logger');
const { redis } = require('../lib/redis');

const createKey = (url, prefix) => {
  const namespace = `t:${prefix}:`;

  try {
    return namespace.concat(
      crypto
        .createHash('sha256')
        .update(url)
        .digest('base64')
    );
  } catch (error) {
    logger.error(`There was an error processing ${url}`);
    throw error;
  }
};

const createPostKey = uri => {
  return createKey(normalizeUrl(uri), 'post');
};

const createFeedKey = uri => {
  return createKey(uri, 'feed');
};

// Redis Keys
const FEEDS = 'feeds';

const POSTS = 'posts';

module.exports = {
  addFeed: async (name, url) => {
    const key = createFeedKey(url, 'feed');
    await redis
      .multi()
      // Using hmset() until hset() fully supports multiple fields:
      // https://github.com/stipsan/ioredis-mock/issues/345
      // https://github.com/luin/ioredis/issues/551
      .hmset(key, 'name', name, 'url', url)
      .sadd(FEEDS, key)
      .exec();
    return key;
  },

  getFeeds: () => redis.smembers(FEEDS),

  getFeed: feedID => redis.hgetall(feedID),

  getFeedsCount: () => redis.scard(FEEDS),

  addPost: async post => {
    const key = createPostKey(post.guid, 'post');

    await redis
      .multi()
      .hmset(
        // using guid as keys as it is unique to posts
        key,
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
      .zadd(POSTS, post.published.getTime(), key)
      .exec();
  },

  /**
   * Returns an array of guids from redis
   * @param from lower index
   * @param to higher index, it needs -1 because redis includes the element at this index in the returned array
   * @return Array of guids
   */
  getPosts: async (from, to) => {
    const keys = await redis.zrevrange(POSTS, from, to - 1);

    /**
     * 'zrevrange' returns an array of encoded, hashed guids.
     * This array is used to return the 'guid' property in
     * Post objects, which contains the decoded, unhashed version
     * of the guid
     */
    return Promise.all(
      keys.map(async key => {
        const { guid } = await redis.hgetall(key);
        return guid.replace('/^t:post:/', '');
      })
    );
  },

  getPostsCount: () => redis.zcard(POSTS),

  getPost: guid => redis.hgetall(createPostKey(guid, 'post')),
};
