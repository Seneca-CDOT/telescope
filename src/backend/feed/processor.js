/**
 * A processor function to be run concurrently, in its own process, and
 * with potentially multiple simultaneous instances, by the feed queue.
 * https://github.com/OptimalBits/bull#separate-processes
 */

const { parse } = require('feedparser-promised');
const fetch = require('node-fetch');

const { logger } = require('../utils/logger');
const Post = require('../data/post');
const Feed = require('../data/feed');
const ArticleError = require('../data/article-error');

// Check for cached ETag and Last-Modified info on the feed.
function hasHeaders(feed) {
  return feed.etag || feed.lastModified;
}

/**
 * If we have extra cache/modification info about this feed, add it to the headers.
 * @param {Feed} feed - the feed Object, possibly with etag and lastModified info
 */
function addHeaders(options, feed) {
  // If there aren't any cached headers for this feed, return options unmodified
  if (!hasHeaders(feed)) {
    return options;
  }

  // Add conditional headers as appropriate for this feed
  options.headers = {};
  if (feed.etag) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match
    options.headers['If-None-Match'] = feed.etag;
  }
  if (feed.lastModified) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since
    options.headers['If-Modified-Since'] = feed.lastModified;
  }

  return options;
}

/**
 * Get information about the resource at the other end of this feed's url.
 * Specifically, we care about ETag and Last-Modified headers, Content-Type,
 * and whether or not we should try to download it.
 * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests
 */
async function getFeedInfo(feed) {
  const info = {
    status: null,
    etag: null,
    lastModified: null,
    link: null,
    contentType: null,
    shouldDownload: true,
  };

  let response;
  try {
    // Do a HEAD request, and see what the current version info for this URL is
    response = await fetch(feed.url, addHeaders({ method: 'HEAD' }, feed));
    info.status = `[HTTP ${response.status} - ${response.statusText}]`;
    info.contentType = response.headers.get('Content-Type');
    info.link = feed.link;
  } catch (error) {
    logger.error({ error }, `Unable to fetch HEAD info for feed ${feed.url}`);
    throw error;
  }

  // We didn't get a 200 after adding the conditional headers, stop now.
  if (!(response && response.ok)) {
    info.shouldDownload = false;
    return info;
  }

  // Resource version identifier (e.g., W/"ae1acbdfe7ece35f8651d741fcf94465"),
  // unique to the contents of the URL (it if changes, the ETag changes).
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
  const etag = response.headers.get('ETag');
  if (etag) {
    info.etag = etag;
  }

  // Date and Time the server thinks this resource was last modified
  // (e.g., Mon, 16 Dec 2019 14:15:47 GMT).  This may or may not be
  // the actual date/time it was modified. The ETag is more accurate. See:
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
  const lastModified = response.headers.get('Last-Modified');
  if (lastModified) {
    info.lastModified = lastModified;
  }

  return info;
}

/**
 * Convert an array of Articles from the feed parser into Post objects
 * and stores them in Redis.
 * @param {Array<article>} articles to process into posts
 */
function articlesToPosts(articles, feed) {
  return Promise.all(
    articles.map(async article => {
      try {
        await Post.createFromArticle(article, feed);
      } catch (error) {
        // If this is just some missing data, ignore the post, otherwise throw.
        if (error instanceof ArticleError) {
          return;
        }
        throw error;
      }
    })
  );
}

/**
 * The processor for the feed queue receives feed jobs, where
 * the job to process is an Object with the `id` of the feed.
 * We expect the Feed to already exist in the system at this point.
 */
module.exports = async function processor(job) {
  const feed = await Feed.byId(job.data.id);
  if (!feed) {
    throw new Error(`unable to get Feed for id=${job.data.id}`);
  }

  let info;
  const [invalid, delayed] = await Promise.all([feed.isInvalid(), feed.isDelayed()]);
  if (invalid) {
    logger.info(`Skipping resource at ${feed.url}. Feed previously marked invalid`);
    return;
  }
  if (delayed) {
    logger.info(`Skipping resource at ${feed.url}. Feed previously marked for delayed processing`);
    return;
  }
  try {
    info = await getFeedInfo(feed);
    // If we get no new version info, there's nothing left to do.
    if (!info.shouldDownload) {
      // Log some common cases we see, with a general message if none of these
      switch (info.status) {
        case 304:
          logger.info(`${info.status} Feed is up-to-date: ${feed.url}`);
          break;
        case 404:
          logger.warn(`${info.status} Feed not found: ${feed.url}`);
          break;
        case 410:
          logger.warn(`${info.status} Feed no longer available: ${feed.url}`);
          break;
        case 429:
          logger.warn(`${info.status} Feed requested too many times, setting delay: ${feed.url}`);
          await feed.setDelayed(process.env.FEED_PROCESSING_DELAY_SEC || 3600);
          break;
        case 500:
        case 599:
          logger.warn(`${info.status} Feed server error: ${feed.url}`);
          break;
        default:
          logger.info(`${info.status} Feed not downloaded: ${feed.url}`);
          break;
      }

      // No posts were processed.
      return;
    }

    // Download the updated feed contents
    logger.info(`${info.status} Feed has new content: ${feed.url}`);
    const articles = await parse(
      addHeaders(
        {
          url: feed.url,
          // ms to wait for a connection to be assumed to have failed
          timeout: 20 * 1000,
          gzip: true,
        },
        feed
      )
    );
    // Transform the list of articles to a list of Post objects
    await articlesToPosts(articles, feed);

    // Version info for this feed changed, so update the database
    feed.etag = feed.etag || info.etag;
    feed.lastModified = feed.lastModified || info.lastModified;
    // If feed.link is undefined or empty add a link
    if (!feed.link) {
      const linkSet = new Set();
      articles.forEach(article => {
        // We only want to grab the link of the blog once
        if (linkSet.size === 0) {
          linkSet.add(article.meta.link);
        }
      });
      // Destructuring to get the value from the set
      [feed.link] = linkSet;
    }
    await feed.save();
  } catch (error) {
    // If the feedparser can't parse this, we get a 'Not a feed' error
    if (error.message === 'Not a feed') {
      logger.info(
        `Skipping resource at ${feed.url}, not a valid feed ${
          info.contentType ? `(${info.contentType})` : ''
        }`
      );
    } else {
      logger.error({ error }, `Unable to process feed ${feed.url}`);
      throw error;
    }
  }
};
