const storage = require('./utils/storage');

class Feed {
  /**
   * Saves current feed to Redis
   */
  async save() {
    this.feedId = await storage.addFeed(this);
    await storage.storeFeed(this.feedId);
  }

  /**
   * Checks if feed is part active feeds list. If it is, will move feed from active FEEDS set to INACTIVE_FEEDS set
   * else will move ffeed from INACTIVE_FEEDS to FEEDS
   */
  async move() {
    const isActive = await storage.isActive(this);
    if (isActive === 1) {
      await storage.moveFeed(this.feedId, 'feeds', 'inactive_feeds');
    } else {
      await storage.moveFeed(this.feedId, 'inactive_feeds', 'feeds');
    }
  }

  /**
   * Checks if the feed is in the active feeds(FEEDS) set
   */
  async isActive() {
    return storage.isFeedActive(this.feedId);
  }
}

module.exports = Feed;
