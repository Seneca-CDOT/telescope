const crypto = require('crypto');
const normalizeUrl = require('normalize-url');
const { logger } = require('./logger');
const { redis } = require('../lib/redis');

const feedNamespace = 't:feed:';
const postNamespace = 't:post:';

const createKey = (url, prefix) => {
  try {
    return prefix.concat(
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
  return createKey(normalizeUrl(uri), postNamespace);
};

const createFeedKey = uri => {
  return createKey(uri, feedNamespace);
};

// Redis Keys
const FEEDS = 't:feeds';

const POSTS = 't:posts';

module.exports = {
  addFeed: async (name, url) => {
    const key = createFeedKey(url);
    await redis
      .multi()
      // Using hmset() until hset() fully supports multiple fields:
      // https://github.com/stipsan/ioredis-mock/issues/345
      // https://github.com/luin/ioredis/issues/551
      .hmset(key, 'name', name, 'url', url)
      .sadd(FEEDS, key)
      .exec();
  },

  getFeeds: async () => {
    const keys = await redis.smembers(FEEDS);

    /**
     * It's necessary to remove the namespace from all the ids
     * before returning them
     */
    return keys.map(key => key.replace(/^t:feed:/, ''));
  },

  getFeed: feedID => redis.hgetall(feedNamespace.concat(feedID)),

  getFeedsCount: () => redis.scard(FEEDS),

  addPost: async post => {
    const key = createPostKey(post.guid);

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
     * It's necessary to remove the namespace from all the ids
     * before returning them
     */
    return keys.map(key => key.replace(/^t:post:/, ''));
  },

  getPostsCount: () => redis.zcard(POSTS),

  getPost: guid => redis.hgetall(postNamespace.concat(guid)),
};
