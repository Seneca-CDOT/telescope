const feedQueue = require('./queue');
const feedparser = require('./parser');
const storage = require('../utils/storage');
const { logger } = require('../utils/logger');
const Post = require('../post');
const sanitizeHTML = require('../utils/sanitize-html');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  try {
    const posts = await feedparser(url);
    return await Promise.all(
      posts.map(async post => {
        // TODO: run this through text parser
        const sanitizedHTML = await sanitizeHTML.run(post.description);
        return new Post(
          post.author,
          post.title,
          sanitizedHTML,
          'textContent',
          new Date(post.date),
          new Date(post.pubDate),
          post.link,
          post.guid
        );
      })
    );
  } catch (err) {
    const message = `Unable to process feed ${url} for job ${job.id}`;
    logger.error({ err }, message);
    throw new Error(message);
  }
};

exports.start = async function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(exports.workerCallback);
  feedQueue.on('completed', async (job, results) => {
    try {
      await Promise.all(results.map(result => storage.addPost(result)));
    } catch (err) {
      logger.error({ err }, 'Error inserting posts into database');
    }
  });
};
