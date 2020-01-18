const { parse } = require('feedparser-promised');

const feedQueue = require('./queue');
const { logger } = require('../utils/logger');
const Post = require('../post');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  let articles;

  try {
    articles = await parse(url);
  } catch (err) {
    logger.error({ err }, `Unable to process feed ${url}`);
    throw err;
  }

  return articles.map(article => Post.fromArticle(article));
};

exports.start = async function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(exports.workerCallback);

  // When posts are returned from the queue, save them to the database
  feedQueue.on('completed', async (job, posts) => {
    try {
      await Promise.all(posts.map(post => post.save()));
    } catch (err) {
      logger.error({ err }, 'Error inserting posts into database');
    }
  });
};
