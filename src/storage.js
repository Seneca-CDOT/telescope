const Redis = require('ioredis');

const client = new Redis(process.env.REDIS_URL);

module.exports = {
  addFeed: (name, url) => {
    let feedID = 1000;
    const feed = { name, url };
    return client
      .get('feed_id')
      .then((result) => {
        if (!result) client.set('feed_id', 1000);
        else feedID = result;
      })
      .then(() => {
        client
          .pipeline()
          .set(feedID, JSON.stringify(feed))
          .sadd('feeds', feedID)
          .incr('feed_id')
          .exec();
      });
  },

  getFeeds: () => client.smembers('feeds'),

  getFeed: (feedID) => client.get(feedID),
};
