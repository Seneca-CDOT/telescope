const storage = require('./utils/storage');

class Feed {
  /**
   * Saves current feed to appropriate set in Redis
   */
  async save() {
    this.feedId = await storage.addFeed(this);
  }

  /**
   * Checks if feed is part active feeds list. If it is, will move feed from active FEEDS set to INACTIVE_FEEDS set
   */
  async inactive() {
    const isActive = await this.isActive(this);
    if (isActive === 1) {
      await storage.addInactiveFeed();
    }
  }

  /**
   * Marks the feed as active and moves feed to active set
   */
  async active() {
    await this.save();
  }

  /**
   * Checks if the feed is in the active feeds(FEEDS) set
   */
  async isActive() {
    return this.getFeedStatus();
  }
}

module.exports = Feed;
