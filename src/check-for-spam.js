// content refers to the contents of the blog post (article) sent by feedparser
module.exports = function (content) {
  // Minimum words set to 20, can be changed
  const MINWORDS = 20;

  // Functions
  function removeTags(str) { // Removes HTML tags from a string, leaving only plaintext
    if (str != null && str !== '') {
      return str.toString().replace(/<[^>]*>/g, '');
    }
    return '';
  }

  function getWordCount(str) { // Counts number of words in string
    return str.split(' ').length;
  }

  function getCapitalLetters(str) { // Counts number of capital letters in string
    return str.replace(/[^A-Z]/g, '').length;
  }

  function getAllLetters(str) { // Counts number of alphabetical characters in string
    return str.replace(/[^A-Za-z]/g, '').length;
  }

  // The main body of the blog post with all HTML tags removed
  const noTagsDesc = removeTags(content.description);

  // If the title is empty, post is considered spam
  if (content.title != null) {
    // If the word count is under MINWORDS or all characters are capital, post is considered spam
    if (getWordCount(noTagsDesc) > MINWORDS
        && getCapitalLetters(noTagsDesc) < getAllLetters(noTagsDesc)) {
      return false;
    }

    return true;
  }

  return true;
};
