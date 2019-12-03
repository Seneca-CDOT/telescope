const feedparser = require('./parser');
const feedQueue = require('./queue');
const Post = require('../post');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  const posts = await feedparser(url);
  const processedPosts = await Promise.all(
    posts.map(async post => {
      // TODO: run this through text parser and sanitizer
      return new Post(
        post.author,
        post.title,
        post.description,
        'textContent',
        post.date,
        post.pubDate,
        post.link,
        post.guid
      );
    })
  );
  return processedPosts;
};

exports.start = function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(this.workerCallback);
};
