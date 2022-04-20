const linkifyHtml = require('linkify-html');
const { getPost, addPost } = require('../utils/storage');
const { logger } = require('../utils/logger');
const processHTML = require('../utils/html');
const textParser = require('../utils/text-parser');
const Feed = require('./feed');
const hash = require('./hash');
const ArticleError = require('./article-error');
const { indexPost } = require('../utils/indexer');

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

/**
 * Makes sure that the given feed is a Feed and not just an id.  If the latter
 * it gets the full feed.
 * @param {Feed|String} feed a Feed object or feed id
 * Returns a Promise<Feed>
 */
function ensureFeed(feed) {
  return feed instanceof Feed ? Promise.resolve(feed) : Feed.byId(feed);
}

/**
 * @param {string} url
 * @returns {"video" | "blogpost"} the post's type
 */
function determinePostType(url) {
  try {
    const associatedLink = new URL(url);

    if (associatedLink.hostname.includes('youtube.com')) {
      return 'video';
    }
    // Assume that we are dealing with a blogpost if we
    // are not dealing with videos
    return 'blogpost';
  } catch {
    return 'blogpost';
  }
}

class Post {
  constructor(title, html, datePublished, dateUpdated, postUrl, guid, feed) {
    // Use the post's guid as our unique identifier
    this.id = hash(guid);
    this.title = title;
    this.html = html;
    this.published = ensureDate(datePublished);
    this.updated = ensureDate(dateUpdated, datePublished);
    // create an absolute url if postURL is relative
    this.url = new URL(postUrl, feed.url).href;
    this.guid = guid;
    this.type = determinePostType(this.url);

    // We expect to get a real Feed vs. a feed id
    if (!(feed instanceof Feed)) {
      throw new Error(`expected feed to be a Feed Object, got '${feed}'`);
    }
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
   * Parse an article object into a Post object.
   * @param {Object} article parsed via feedparser, see:
   * https://www.npmjs.com/package/feedparser#what-is-the-parsed-output-produced-by-feedparser
   *
   * If data is missing, throws an error.
   */
  static async createFromArticle(article, feed) {
    // Validate the properties we get, and if we don't have them all, throw
    if (!article) {
      throw new Error('unable to parse, missing article');
    }

    if (article.contentEncoded) article.content = article.contentEncoded;

    if (article.mediaGroup) article.content = article.mediaGroup['media:description'];

    // A valid RSS/Atom feed can have missing fields that we care about.
    // Keep track of any that are missing, and throw if necessary.
    const missing = [];
    // article.content is the content of the post
    if (!article.content) missing.push('content');
    // link is the URL of the post
    if (!article.link) missing.push('link');
    // guid is the unique identifier of the post
    if (!article.guid) missing.push('guid');
    // pubdate is the publication date of the post
    if (!article.pubdate) missing.push('pubdate');

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

    // Allow for missing date of most recent update, use original publication date instead
    if (!article.date) {
      logger.debug('article missing date of last update, substituting publication date');
      article.date = article.pubdate;
    }

    // All the YouTube feed return an array off html so we will need to convert it to a string so as to process and sanitize it
    if (Array.isArray(article.content)) {
      article.content = article.content.join(' ');
    }

    // Wrap an <a> tag on any link inside our content
    article.content = linkifyHtml(article.content);

    let html;

    try {
      // The article.content is frequently the full HTML article content.
      // Sanitize it of any scripts or other dangerous attributes/elements,
      // add lazy loading for <img> and <iframe>, and syntax highlight all
      // <pre><code>...</code></pre> blocks.
      html = processHTML(article.content);
    } catch (error) {
      logger.error({ error }, 'Unable to process HTML for feed');
      throw error;
    }

    // NOTE: feedparser article properties are documented here:
    // https://www.npmjs.com/package/feedparser#list-of-article-properties
    const post = new Post(
      article.title,
      // processed HTML version of the post
      html,
      // pubdate (original published date)
      article.pubdate,
      // date (most recent update)
      article.date,
      // link is the url to the post
      article.link,
      article.guid,
      feed
    );
    await Promise.all([post.save(), indexPost(post)]);
    return post.id;
  }

  /**
   * Creates a new Post object by extracting data from the given post-like object.
   * @param {Object} postData - an Object containing the necessary fields.  The
   * feed property can be an id or a full Feed Object.
   * Returns the newly created Post's id.
   */
  static async create(postData) {
    // If we only have a feed id, get the full Feed Object instead.
    const feed = await ensureFeed(postData.feed);
    const post = new Post(
      postData.title,
      postData.html,
      postData.published,
      postData.updated,
      postData.url,
      postData.guid,
      feed
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

    const feed = await ensureFeed(data.feed);
    const post = new Post(
      data.title,
      data.html,
      data.published,
      data.updated,
      data.url,
      data.guid,
      feed
    );
    return post;
  }
}

module.exports = Post;
