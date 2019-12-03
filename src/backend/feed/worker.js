const feedQueue = require('./queue');
const feedParser = require('./parser');
const extractUrls = require('../utils/extract-urls');
const storage = require('../utils/storage');
// const logger = require('./../utils/logger');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  try {
    const posts = await feedParser(url);
    const processedPosts = [];
    if (posts.length > 0) {
      posts.forEach(post => {
        // We can extract any other information from the post that we need here.
        const processedPost = {
          author: post.author,
          date: post.date,
          title: post.title,
          description: post.description,
          postURL: post.link,
        };
        processedPosts.push(processedPost);
        extractUrls.extract(post.description);
      });
      return processedPosts;
    }
    return processedPosts;
    // return processedPosts;
  } catch (err) {
    return err;
  }
};

exports.start = async function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(exports.workerCallback);
  feedQueue.on('completed', (job, results) => {
    if (results.length > 0) {
      Promise.all(async result => storage.addPost(result));
    }
  });
};
