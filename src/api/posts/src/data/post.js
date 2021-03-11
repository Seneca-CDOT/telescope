const { getPost, addPost } = require('../storage');
const textParser = require('../text-parser');
const hash = require('../../../auth/src/hash');

/**
 * Makes sure that a given date can be constructed as a Date object
 * Returns a constructed Date object, if possible
 * Otherwise throws an Error
 * @param {Object} date an Object to construct as a Date object
 * @param {Date} [fallbackDate] an optional second Date to construct in case the first fails to do so
 */
function ensureDate(date, fallbackDate) {
  if (
    date &&
    (Object.prototype.toString.call(date) === '[object String]' ||
      (Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date)))
  ) {
    return new Date(date);
  }
  if (Object.prototype.toString.call(fallbackDate) === '[object Date]') {
    return new Date(fallbackDate);
  }

  throw new Error(`post has an invalid date: ${date}'`);
}

class Post {
  constructor(title, html, datePublished, dateUpdated, postUrl, guid, feed) {
    // Use the post's guid as our unique identifier
    this.id = hash(guid);
    this.title = title;
    this.html = html;
    this.published = ensureDate(datePublished);
    this.updated = ensureDate(dateUpdated, datePublished);
    this.url = postUrl;
    this.guid = guid;
    this.feed = feed;
  }

  /**
   * Save the current Post to the database, swapping the feed's id
   * for the entire Feed object.
   * Returns a Promise.
   */
  save() {
    return addPost({
      ...this,
      feed: this.feed.id,
    });
  }

  /**
   * Generate the plain text version of this post on demand vs. storing
   */
  get text() {
    return textParser(this.html);
  }

  get author() {
    return this.feed.author;
  }

  /**
   * Creates a new Post object by extracting data from the given post-like object.
   * @param {Object} postData - an Object containing the necessary fields.  The
   * feed property can be an id or a full Feed Object.
   * Returns the newly created Post's id.
   */
  static async create(postData) {
    // If we only have a feed id, get the full Feed Object instead.
    const post = new Post(
      postData.title,
      postData.html,
      postData.published,
      postData.updated,
      postData.url,
      postData.guid
    );
    await post.save();
    return post.id;
  }

  /**
   * Returns a Post from the database using the given id
   * @param {String} id - the id of a post (hashed guid) to get from Redis.
   */
  static async byId(id) {
    const data = await getPost(id);
    // No post found using this id
    if (!(data && data.id)) {
      return null;
    }

    const post = new Post(data.title, data.html, data.published, data.updated, data.url, data.guid);
    return post;
  }
}

module.exports = Post;
