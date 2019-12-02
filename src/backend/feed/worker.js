const feedparser = require('./parser');
const feedQueue = require('./queue');

exports.workerCallback = async function(job) {
  const { url } = job.data;
  const posts = await feedparser(url);
  return posts.map(post => ({
    author: post.author,
    date: post.date,
    title: post.title,
    description: post.description,
    postURL: post.link,
  }));
};

exports.start = function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(this.workerCallback);
};
