const normalizeUrl = require('normalize-url');

const { getFeed, addFeed } = require('../utils/storage');
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
   * Creates a Feed by extracting data from the given feed-like object.
   * @param {Object} o - an Object containing the necessary fields for a feed
   */
  static parse(o) {
    return new Feed(o.author, o.url, o.etag, o.lastModified);
  }

  /**
   * Returns a Feed from the database using the given id
   * @param {String} id - the id of a feed (hashed, normalized url) to get from Redis.
   */
  static async byId(id) {
    const feed = await getFeed(id);
    // No feed found using this id
    if (!(feed && feed.id)) {
      return null;
    }
    return Feed.parse(feed);
  }

  /**
   * Returns a Feed from the database using the given url
   * @param {String} url - the url of a feed to get from Redis.
   */
  static async byUrl(url) {
    // Use the URL to generate an id
    const id = urlToId(url);
    const feed = await this.byId(id);
    // No feed found using this url's id
    if (!(feed && feed.id)) {
      return null;
    }
    return Feed.parse(feed);
  }
}

module.exports = Feed;
