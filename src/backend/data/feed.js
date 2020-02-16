const normalizeUrl = require('normalize-url');

const {
  getFeed,
  addFeed,
  setInvalidFeed,
  isInvalid,
  setDelayedFeed,
  isDelayed,
} = require('../utils/storage');
const hash = require('./hash');

const urlToId = url => hash(normalizeUrl(url));

class Feed {
  constructor(author, url, etag, lastModified) {
    if (!url) {
      throw new Error('missing url for feed');
    }
    if (!author) {
      throw new Error('missing author for feed');
    }
    // Use the feed's normalized url as our unique identifier
    this.id = urlToId(url);
    this.author = author;
    this.url = url;
    // We may or may not have these cache values when we create a feed.
    this.etag = etag === '' ? null : etag;
    this.lastModified = lastModified === '' ? null : lastModified;
  }

  /**
   * Save the current Feed to the database.
   * Returns a Promise.
   */
  save() {
    addFeed(this);
  }

  /**
   * Adds the current Feed to the database with the specified reason
   * Returns a Promise
   */
  setInvalid(reason) {
    return setInvalidFeed(this.id, reason);
  }

  /**
   * Checks whether the current feed is valid or not
   */
  isInvalid() {
    return isInvalid(this.id);
  }

  /**
   * Flags a feed in the database, indicating that its processing should be delayed
   * @param {Number} seconds - duration in seconds for which processing should wait
   * Returns a Promise
   */
  setDelayed(seconds) {
    return setDelayedFeed(this.id, seconds);
  }

  /**
   * Checks whether the current feed is delayed or not
   * Returns a Promise<Boolean>
   */
  isDelayed() {
    return isDelayed(this.id);
  }

  /**
   * Creates a new Feed object by extracting data from the given feed-like object.
   * @param {Object} feedData - an Object containing the necessary fields.
   * Returns the newly created Feed's id.
   */
  static async create(feedData) {
    const feed = new Feed(feedData.author, feedData.url, feedData.etag, feedData.lastModified);
    await feed.save();
    return feed.id;
  }

  /**
   * Returns a Feed from the database using the given id
   * @param {String} id - the id of a feed (hashed, normalized url) to get from Redis.
   * Returns a Promise<Feed>
   */
  static async byId(id) {
    const data = await getFeed(id);
    // No feed found using this id
    if (!(data && data.id)) {
      return null;
    }

    return new Feed(data.author, data.url, data.etag, data.lastModified);
  }

  /**
   * Returns a Feed from the database using the given url
   * @param {String} url - the url of a feed to get from Redis.
   * Returns a Promise<Feed>
   */
  static byUrl(url) {
    // Use the URL to generate an id
    const id = urlToId(url);
    return this.byId(id);
  }
}

module.exports = Feed;
