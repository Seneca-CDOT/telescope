const storage = require('./utils/storage');

/**
 * Feed Object, upon being created all feeds will be active and have a feedId of 0 until saved into Redis
 * @param url url of feed
 * @param name author name of feed
 * @param feedId unique id for feed
 */
class Feed {
  constructor(url, name) {
    this.url = url;
    this.name = name;
    this.inactive = false;
    this.feedId = 0;
  }

  /**
   * Saves current feed to appropriate set in Redis
   */
  async save() {
    this.feedId = await storage.addFeed(this);
  }

  /**
   * Marks the feed as inactive
   */
  inactive() {
    this.inactive = true;
    this.save();
  }
}

module.exports = Feed;
