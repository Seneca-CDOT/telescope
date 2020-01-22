const crypto = require('crypto');
const normalizeUrl = require('normalize-url');
const { logger } = require('./logger');
const { redis } = require('../lib/redis');

// Redis Keys
const feedsKey = 't:feeds';
const postsKey = 't:posts';

// Namespaces
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
    logger.error(`There was an error hashing the url ${url}`);
    throw error;
  }
};

const createPostKey = uri => {
  return createKey(uri, postNamespace);
};

const createFeedKey = uri => {
  return createKey(normalizeUrl(uri), feedNamespace);
};

module.exports = {
  addFeed: async (name, url) => {
    const key = createFeedKey(url);
    await redis
      .multi()
      // Using hmset() until hset() fully supports multiple fields:
      // https://github.com/stipsan/ioredis-mock/issues/345
      // https://github.com/luin/ioredis/issues/551
      .hmset(key, 'name', name, 'url', url)
      .sadd(feedsKey, key)
      .exec();
  },

  getFeeds: async () => {
    const keys = await redis.smembers(feedsKey);

    /**
     * It's necessary to remove the namespace from all the ids
     * before returning them
     */
    const feedNamespaceRe = new RegExp(`^${feedNamespace}`);
    return keys.map(key => key.replace(feedNamespaceRe, ''));
  },

  getFeed: feedID => redis.hgetall(feedNamespace.concat(feedID)),

  getFeedsCount: () => redis.scard(feedsKey),

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
      .zadd(postsKey, post.published.getTime(), key)
      .exec();
  },

  /**
   * Returns an array of guids from redis
   * @param from lower index
   * @param to higher index, it needs -1 because redis includes the element at this index in the returned array
   * @return Array of guids
   */
  getPosts: async (from, to) => {
    const keys = await redis.zrevrange(postsKey, from, to - 1);

    /**
     * It's necessary to remove the namespace from all the ids
     * before returning them
     */
    const postNamespaceRe = new RegExp(`^${postNamespace}`);
    return keys.map(key => key.replace(postNamespaceRe, ''));
  },

  getPostsCount: () => redis.zcard(postsKey),

  getPost: guid => redis.hgetall(postNamespace.concat(guid)),
};
