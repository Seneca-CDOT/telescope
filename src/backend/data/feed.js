const normalizeUrl = require('normalize-url');

const {
  getFeed,
  getFeeds,
  addFeed,
  removeFeed,
  setInvalidFeed,
  isInvalid,
  setDelayedFeed,
  isDelayed,
  removePost,
  getPost,
  getPosts,
  getFlaggedFeeds,
  setFlaggedFeed,
  unsetFlaggedFeed,
} = require('../utils/storage');

const { deletePost } = require('../utils/indexer');

const hash = require('./hash');

const urlToId = (url) => hash(normalizeUrl(url));

class Feed {
  constructor(author, url, user, link, etag, lastModified) {
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
    this.user = user;
    this.link = link;

    // We may or may not have these cache values when we create a feed.
    this.etag = etag === '' ? null : etag;
    this.lastModified = lastModified === '' ? null : lastModified;
  }

  /**
   * Save the current Feed to the database.
   * Returns a Promise.
   */
  save() {
    return addFeed(this);
  }

  /**
   * Removes current Feed + associated Posts from the databases.
   * Returns a Promise
   */
  async delete() {
    // Removing feeds and getting all posts, we'll be assigning all the Posts we get back to posts
    let [, posts] = await Promise.all([removeFeed(this.id), getPosts(0, 0)]);

    // Filter out all posts which do not contain feed id of feed being removed
    posts = await Promise.all(posts.map((id) => getPost(id)));
    posts = posts.filter((post) => post.feed === this.id);

    // Remove the post from Redis + ElasticSearch
    await Promise.all(
      [].concat(
        posts.map((post) => removePost(post.id)),
        posts.map((post) => deletePost(post.id))
      )
    );
  }

  /**
   * Updates current Feed in the database.
   * Returns a Promise.
   */
  async update() {
    await this.delete();
    await this.save();
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
   * Returns a Promise<Boolean>.
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
  async isDelayed() {
    return (await isDelayed(this.id)) === 1;
  }

  /**
   * Flags the feed, preventing posts from the feed to be displayed
   * Returns a Promise<Boolean>
   */
  flag() {
    return setFlaggedFeed(this.id);
  }

  /**
   * Unflags the feed, allowing posts from the feed to be displayed
   * Returns a Promise<Boolean>
   */
  unflag() {
    return unsetFlaggedFeed(this.id);
  }

  /**
   * Creates a new Feed object by extracting data from the given feed-like object.
   * @param {Object} feedData - an Object containing the necessary fields.
   * Returns the newly created Feed's id as a Promise<String>
   */
  static async create(feedData) {
    const feed = new Feed(
      feedData.author,
      feedData.url,
      feedData.user,
      feedData.link,
      feedData.etag,
      feedData.lastModified
    );
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
    return new Feed(data.author, data.url, data.user, data.link, data.etag, data.lastModified);
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

  /**
   * Returns all unflagged feeds
   * Returns a Promise<Feeds>
   */
  static async all() {
    const ids = await getFeeds();
    return Promise.all(ids.map(Feed.byId));
  }

  /**
   * Returns all flagged feeds
   * Returns a Promise<Feeds>
   */
  static async flagged() {
    const ids = await getFlaggedFeeds();
    return Promise.all(ids.map(Feed.byId));
  }

  /**
   * Sets all stored feeds' lastModified + etag field to null. Used for production
   * Returns a Promise
   */
  static async clearCache() {
    const allFeeds = await this.all();
    await Promise.all(
      allFeeds.map((feed) => {
        feed.etag = null;
        feed.lastModified = null;
        return feed.save();
      })
    );
  }
}

module.exports = Feed;
