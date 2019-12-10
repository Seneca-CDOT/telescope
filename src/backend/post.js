const { getPost, addPost } = require('./utils/storage');
const { logger } = require('./utils/logger');
const sanitizeHTML = require('./utils/sanitize-html');

function toDate(date) {
  // Is this already a Date?
  if (typeof date === 'object' && typeof date.getTime === 'function') {
    return date;
  }

  return new Date(date);
}

class Post {
  constructor(author, title, html, text, datePublished, dateUpdated, postUrl, siteUrl, guid) {
    this.author = author;
    this.title = title;
    this.html = html;
    this.text = text;
    this.published = toDate(datePublished);
    this.updated = toDate(dateUpdated);
    this.url = postUrl;
    this.site = siteUrl;
    this.guid = guid;
  }

  /**
   * Save the current Post to the database.
   */
  async save() {
    await addPost(this);
  }

  /**
   * Parse an article object into a Post object.
   * @param {Object} article parsed via feedparser, see:
   * https://www.npmjs.com/package/feedparser#what-is-the-parsed-output-produced-by-feedparser
   */
  static fromArticle(article) {
    // Validate the properties we get, and if we don't have them all, throw
    if (!article) {
      throw new Error('unable to parse, missing article');
    }

    // A valid RSS/Atom feed can have missing fields that we care about.
    // Keep track of any that are missing, and throw if necessary.
    let missing = [];
    if (!article.author) missing.push('author');
    if (!article.description) missing.push('description');
    if (!article.pubdate) missing.push('pubdate');
    if (!article.date) missing.push('date');
    if (!article.link) missing.push('link');
    if (!article.guid) missing.push('guid');
    if (!(article.meta && article.meta.link)) missing.push('meta.link');

    if (missing.length) {
      let message = `invalid article: missing ${missing.join(', ')}`;
      logger.debug(message);
      throw new Error(message);
    }

    // Allow for missing title, but give it one
    if (!article.title) {
      logger.debug('article missing title, substituting "Untitled"');
      article.title || 'Untitled';
    }

    // NOTE: feedparser article properties are documented here:
    // https://www.npmjs.com/package/feedparser#list-of-article-properties
    return new Post(
      article.author,
      article.title,
      // description (frequently, the full article content).
      // Clean it of any scripts or other dangerous attributes/elements
      sanitizeHTML(article.description),
      // TODO: run this through text parser
      article.description,
      // pubdate (original published date)
      article.pubdate,
      // date (most recent update)
      article.date,
      // link is the url to the post
      article.link,
      // meta.link is the url to the site
      article.meta.link,
      article.guid
    );
  }

  /**
   * Creates a Post by extracting data from the given post-like object.
   * @param {Object} o - an Object containing the necessary fields
   */
  static parse(o) {
    return new Post(
      o.author,
      o.title,
      o.html,
      o.text,
      o.published,
      o.updated,
      o.url,
      o.site,
      o.guid
    );
  }

  /**
   * Returns a Post from the database using the given guid
   * @param {String} guid - the guid of a post to get from the database.
   */
  static async byGuid(guid) {
    const post = await getPost(guid);
    // No post found using this guid
    if (post && !post.guid) {
      return null;
    }
    return Post.parse(post);
  }
}

module.exports = Post;
