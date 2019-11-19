const feedQueue = require('./feed-queue');
const feedParser = require('./feed-parser');
const extractUrls = require('./extract-urls');

exports.start = function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(async job => {
    const { url } = job.data;
    const posts = await feedParser(url);
    const processedPosts = [];
    if (posts.length > 0) {
      posts.forEach(post => {
        // We can extract any other infromation from the post that we need here.
        const processedPost = {
          author: post.author,
          date: post.date,
          title: post.title,
          description: post.description,
          postURL: post.link
        };
        processedPosts.push(processedPost);
        extractUrls.extract(post.description);
      });
      // We can pass these objects into another queue, For now just printing to the console.
      console.log(processedPosts);
    }
  });
};
