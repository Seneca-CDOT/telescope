const { logger } = require('@senecacdot/satellite');
const redis = require('./redis');
// Redis Keys

const feedsKey = 't:feeds';
const flaggedFeedsKey = 't:feeds:flagged';
const postsKey = 't:posts';

// Namespaces
const feedNamespace = 't:feed:';
const postNamespace = 't:post:';
// Suffixes
const invalidSuffix = ':invalid';
const delayedSuffix = ':delayed';

// "6Xoj0UXOW3" to "t:post:6Xoj0UXOW3"
const createPostKey = (id) => postNamespace.concat(id);
// "NirlSYranl" to "t:feed:NirlSYranl"
const createFeedKey = (id) => feedNamespace.concat(id);
// "NirlSYranl" to "t:feed:NirlSYranl:invalid"
const createInvalidFeedKey = (id) => createFeedKey(id).concat(invalidSuffix);
// "NirlSYranl" to "t:feed:NirlSYranl:delayed"
const createDelayedFeedKey = (id) => createFeedKey(id).concat(delayedSuffix);

const getFeedKeysUsingScanStream = (matchPattern) => {
  const keys = new Set();
  const stream = redis.scanStream({
    match: matchPattern,
  });
  return new Promise((resolve, reject) => {
    stream.on('data', (data = []) => {
      data.forEach((k) => keys.add(k));
    });
    stream.on('error', (err) => {
      logger.error({ err }, 'Error while scanning redis keys');
      reject(new Error('Error while scanning redis keys'));
    });
    stream.on('end', () => {
      resolve([...keys]);
    });
  });
};

module.exports = {
  /**
   * Feeds
   */
  addFeed: async (feed) => {
    // Check if feed being added already exists in flagged feeds set
    // If it is, do nothing
    if (await redis.sismember(flaggedFeedsKey, feed.id)) return;

    const key = createFeedKey(feed.id);
    await redis
      .multi()
      .hset(
        key,
        'id',
        feed.id,
        'author',
        feed.author,
        'url',
        feed.url,
        'user',
        feed.user,
        'link',
        feed.link,
        'etag',
        feed.etag,
        'lastModified',
        feed.lastModified
      )
      .sadd(feedsKey, feed.id)
      .exec();
  },

  getFeeds: () => redis.smembers(feedsKey),

  getInvalidFeeds: async () => {
    const invalidKeys = await getFeedKeysUsingScanStream(`${feedNamespace}*${invalidSuffix}`);
    return Promise.all(
      invalidKeys.map(async (key) => {
        const reason = await redis.get(key);
        const id = key.replace(feedNamespace, '').replace(invalidSuffix, '');
        return {
          id,
          reason: reason.replace(/\n/g, ' '),
        };
      })
    );
  },

  getDelayedFeeds: async () => {
    const delayedKeys = await getFeedKeysUsingScanStream(`${feedNamespace}*${delayedSuffix}`);
    return delayedKeys.map((key) => {
      const id = key.replace(feedNamespace, '').replace(delayedSuffix, '');
      return {
        id,
      };
    });
  },

  getFlaggedFeeds: () => redis.smembers(flaggedFeedsKey),

  getFeed: (id) => redis.hgetall(feedNamespace.concat(id)),

  getFeedsCount: () => redis.scard(feedsKey),

  setInvalidFeed: (id, reason) => {
    const key = createInvalidFeedKey(id);
    const sevenDaysInSeconds = 60 * 60 * 24 * 7; // Expire after 7 days
    return redis.set(key, reason, 'EX', sevenDaysInSeconds);
  },

  /**
   * Removes a feed entry from redis
   * @param id id of feed to be removed
   */
  removeFeed: async (id) => {
    const key = createFeedKey(id);
    // Checks which set the feed is currently in
    const redisKey = (await redis.sismember(feedsKey, id)) ? feedsKey : flaggedFeedsKey;
    try {
      await redis
        .multi()
        .hdel(key, 'id', 'author', 'url', 'user', 'link', 'etag', 'lastModified')
        .srem(redisKey, id)
        .exec();
    } catch (error) {
      logger.error({ error }, `Error removing Feed ${id} from Redis`);
      throw new Error(`Error trying to remove feed from Redis`);
    }
  },

  setFlaggedFeed: (id) => redis.smove(feedsKey, flaggedFeedsKey, id),

  unsetFlaggedFeed: (id) => redis.smove(flaggedFeedsKey, feedsKey, id),

  isInvalid: (id) => redis.exists(createInvalidFeedKey(id)),

  setDelayedFeed: (id, seconds) => redis.set(createDelayedFeedKey(id), seconds, 'EX', seconds),

  isDelayed: (id) => redis.exists(createDelayedFeedKey(id)),

  /**
   * Posts
   */
  addPost: async (post) => {
    const key = createPostKey(post.id);
    await redis
      .multi()
      .hset(
        key,
        'id',
        post.id,
        'title',
        post.title,
        'html',
        post.html,
        'published',
        post.published,
        'updated',
        post.updated,
        'url',
        post.url,
        'guid',
        post.guid,
        'feed',
        post.feed
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

  /**
   * Returns an array of post ids from redis
   * @param start starting Date in the range
   * @param end ending Date in the range
   * @return Array of ids
   */
  getPostsByDate: (startDate, endDate) =>
    redis.zrangebyscore(postsKey, startDate.getTime(), endDate.getTime()),

  getPostsCount: () => redis.zcard(postsKey),

  getPost: (id) => redis.hgetall(postNamespace.concat(id)),

  /**
   * Removes a post entry from redis
   * NOTE: removing a post from redis should also require the post to be removed from ElasticSearch
   * @param id id of post to be removed
   */
  removePost: async (id) => {
    const key = createPostKey(id);
    await redis
      .multi()
      .hdel(key, 'id', 'title', 'html', 'published', 'updated', 'url', 'guid', 'feed')
      .zrem(postsKey, id)
      .exec();
  },
};
