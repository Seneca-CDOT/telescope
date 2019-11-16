const redis = require('./lib/redis');

// Redis Keys
const FEED_ID = 'feed_id';
const FEEDS = 'feeds';

const toJSON = (o) => JSON.stringify(o);
const fromJSON = (s) => JSON.parse(s);

module.exports = {
  addFeed: async (name, url) => {
    // "If the key does not exist, it is set to 0 before performing the operation"
    // https://redis.io/commands/INCR
    const feedId = await redis.incr(FEED_ID);
    await redis
      .pipeline()
      .set(feedId, toJSON({ name, url }))
      .sadd('feeds', feedId)
      .exec();
    return feedId;
  },

  getFeeds: () => redis.smembers(FEEDS),

  getFeed: async (feedID) => fromJSON(await redis.get(feedID)),
};
