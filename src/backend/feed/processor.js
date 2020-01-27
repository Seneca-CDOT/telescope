/**
 * A processor function to be run concurrently, in its own process, and
 * with potentially multiple simultaneous instances, by the feed queue.
 * https://github.com/OptimalBits/bull#separate-processes
 */

const { parse } = require('feedparser-promised');

const { logger } = require('../utils/logger');
const Post = require('../data/post');

module.exports = async function processor(job) {
  const { url } = job.data;
  const httpOptions = {
    url,
    // ms to wait for a connection to be assumed to have failed
    timeout: 20 * 1000,
    gzip: true,
  };
  let articles;

  try {
    articles = await parse(httpOptions);
  } catch (error) {
    logger.error({ error }, `Unable to process feed ${url}`);
    throw error;
  }

  // Transform the list of articles to a list of Post objects
  return articles.map(article => Post.fromArticle(article));
};
