const feedQueue = require('./feed-queue');
const feedParser = require('./feed-parser');

exports.start = function () {
  // Start processing jobs from the feed queue...
  feedQueue.process(async (job) => {
    const { url } = job.data;
    const posts = await feedParser(url);
    const processedPosts = [];
    if (posts.length > 0) {
      posts.forEach((post) => {
        // We can extract any other infromation from the post that we need here.
        const processedPost = {
          author: post.author,
          date: post.date,
          title: post.title,
          description: post.description,
          postURL: post.link,
        };
        processedPosts.push(processedPost);
      });
    }
    return processedPosts;
  });
};
