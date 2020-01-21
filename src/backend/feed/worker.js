const { parse } = require('feedparser-promised');

const feedQueue = require('./queue');
const { logger } = require('../utils/logger');
const Post = require('../post');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  let articles;

  try {
    articles = await parse(url);
  } catch (error) {
    logger.error({ error }, `Unable to process feed ${url}`);
    throw error;
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
    } catch (error) {
      logger.error({ error }, 'Error inserting posts into database');
    }
  });
};
