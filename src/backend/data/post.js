const { getPost, addPost } = require('../utils/storage');
const { logger } = require('../utils/logger');
const sanitizeHTML = require('../utils/sanitize-html');
const textParser = require('../utils/text-parser');
const hash = require('./hash');
const ArticleError = require('./article-error');

function toDate(date) {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

class Post {
  constructor(title, html, datePublished, dateUpdated, postUrl, guid, feed) {
    // Use the post's guid as our unique identifier
    this.id = hash(guid);
    this.title = title;
    this.html = html;
    this.published = datePublished ? toDate(datePublished) : new Date();
    this.updated = dateUpdated ? toDate(dateUpdated) : new Date();
    this.url = postUrl;
    this.guid = guid;
    this.feed = feed;
  }

  /**
   * Save the current Post to the database.
   * Returns a Promise.
   */
  save() {
    addPost(this);
  }

  /**
   * Generate the plain text version of this post on demand vs. storing
   */
  get text() {
    return textParser(this.html);
  }

  /**
   * Parse an article object into a Post object.
   * @param {Object} article parsed via feedparser, see:
   * https://www.npmjs.com/package/feedparser#what-is-the-parsed-output-produced-by-feedparser
   *
   * If data is missing, throws an error.
   */
  static fromArticle(article, feed) {
    // Validate the properties we get, and if we don't have them all, throw
    if (!article) {
      throw new Error('unable to parse, missing article');
    }

    // A valid RSS/Atom feed can have missing fields that we care about.
    // Keep track of any that are missing, and throw if necessary.
    const missing = [];
    if (!article.description) missing.push('description');
    if (!article.link) missing.push('link');
    if (!article.guid) missing.push('guid');

    if (missing.length) {
      const message = `invalid article: missing ${missing.join(', ')}`;
      logger.debug(message);
      throw new ArticleError(message);
    }

    // Allow for missing title, but give it one
    if (!article.title) {
      logger.debug('article missing title, substituting "Untitled"');
      article.title = 'Untitled';
    }

    // If we're missing dates, assign current date
    const today = new Date();
    if (!article.pubdate) {
      logger.debug('article missing pubdate, substituting current date');
      article.pubdate = today;
    }
    if (!article.date) {
      logger.debug('article missing date, substituting current date');
      article.date = today;
    }

    let sanitizedHTML;
    try {
      // The article.description is frequently the full HTML article content.
      // Sanitize it of any scripts or other dangerous attributes/elements
      sanitizedHTML = sanitizeHTML(article.description);
    } catch (error) {
      logger.error({ error }, 'Unable to sanitize and parse HTML for feed');
      throw error;
    }

    // NOTE: feedparser article properties are documented here:
    // https://www.npmjs.com/package/feedparser#list-of-article-properties
    return new Post(
      article.title,
      // sanitized HTML version of the post
      sanitizedHTML,
      // pubdate (original published date)
      article.pubdate,
      // date (most recent update)
      article.date,
      // link is the url to the post
      article.link,
      article.guid,
      feed
    );
  }

  /**
   * Creates a Post by extracting data from the given post-like object.
   * @param {Object} o - an Object containing the necessary fields
   */
  static parse(o) {
    return new Post(o.title, o.html, o.published, o.updated, o.url, o.guid, o.feed);
  }

  /**
   * Returns a Post from the database using the given id
   * @param {String} id - the id of a post (hashed guid) to get from Redis.
   */
  static async byId(id) {
    const post = await getPost(id);
    // No post found using this id
    if (!(post && post.id)) {
      return null;
    }
    return Post.parse(post);
  }
}

module.exports = Post;
