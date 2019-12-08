const feedQueue = require('./queue');
const feedparser = require('./parser');
const { logger } = require('../utils/logger');
const Post = require('../post');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  try {
    const articles = await feedparser(url);
    return articles.map(article => Post.fromArticle(article));
  } catch (err) {
    const message = `Unable to process feed ${url} for job ${job.id}`;
    logger.error({ err }, message);
    throw new Error(message);
  }
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
