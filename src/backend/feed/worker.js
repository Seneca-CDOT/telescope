const feedQueue = require('./queue');
const feedParser = require('./parser');
const extractUrls = require('../utils/extract-urls');
const Post = require('../post');
//const textParser = require('../utils/text-parser');
const wordCount = require('../utils/word-counter');

async function processContent(post) {
  let postObj;
  try {
    // await textParser.run(post.description).then(function (data) {
    postObj = new Post(
      post.author,
      post.title,
      post.description,
      post.date,
      post.pubDate,
      post.link,
      post.guid
    );
    extractUrls.extract(post.description);
    // });
  } catch (err) {
    console.log(`Failed to parse text from post: ${post.guid}`);
  }

  try {
    postObj.wordCount = await wordCount.wordCounter(postObj.content);
  } catch (err) {
    console.log(`Failed to get word count from the post: ${post.guid}`);
  }
  return postObj;
}

exports.workerCallback = async function(job) {
  const { url } = job.data;
  try {
    const posts = await feedParser(url);
    const processedPosts = [];

    if (posts.length > 0) {
      posts.forEach(post => {
        processContent(post).then(function(processedPost) {
          processedPosts.push(processedPost);
          extractUrls.extract(post.description);
        });
      });
      return Promise.resolve(processedPosts);
    }
    return Promise.reject(new Error(`Failed to extract posts from url: ${url}`));
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.start = function() {
  // Start processing jobs from the feed queue...
  feedQueue.process(this.workerCallback);
};
