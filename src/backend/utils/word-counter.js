const wordcount = require('wordcount');

exports.wordCounter = async function wordCounter(blogText) {
  return Promise.resolve(wordcount(blogText));
};
