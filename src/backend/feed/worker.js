const feedQueue = require('./queue');
const feedParser = require('./parser');
const extractUrls = require('../utils/extract-urls');

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
      // We can pass these objects into another queue, For now just printing to the console.
      console.log(processedPosts);
    }
  } catch (err) {
    throw Error('The error here is ' + err);
  }
};

exports.start = function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(this.workerCallback);
};
