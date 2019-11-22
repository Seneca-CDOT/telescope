const filter = require('spam-filter')('naiveBayes');
const textParser = require('./text-parser');

// content refers to the contents of the blog post (article) sent by feedparser
module.exports = async function(content) {
  // Minimum words set to 20, can be changed
  const MINWORDS = 5;

  function getWordCount(str) {
    // Counts number of words in string
    return str.split(' ').length;
  }

  function getCapitalLetters(str) {
    // Counts number of capital letters in string
    return str.replace(/[^A-Z]/g, '').length;
  }

  function getAllLetters(str) {
    // Counts number of alphabetical characters in string
    return str.replace(/[^A-Za-z]/g, '').length;
  }

  // The main body of the blog post with all HTML tags removed
  const noTagsDesc = await textParser.run(content.description);

  // If the title is empty, post is considered spam
  if (content.title != null) {
    if (content.title !== '' && !filter.isSpam(content.title)) {
      // If the word count is under MINWORDS, all characters are capital,
      // or spam-filter returns true, post is considered spam
      if (
        getWordCount(noTagsDesc) > MINWORDS &&
        getCapitalLetters(noTagsDesc) < getAllLetters(noTagsDesc) &&
        !filter.isSpam(noTagsDesc)
      ) {
        return false;
      }
      return true;
    }
    return true;
  }
  return true;
};
