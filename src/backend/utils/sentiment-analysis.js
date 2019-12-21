/* This file contains the code for analyzing blog posts text to identify the
 * negative or positve words being used in a post and return a summary of it
 * along with a score. The file uses a node module called sentiment to implement
 * the functionality of analyzing text of blogs. The function accepts plain
 * text as a parameter i.e text contains no HTML tags, and returns a promise
 * object which contains the result.
 */
const Sentiment = require('sentiment');

module.exports.run = function(text) {
  const sentiment = new Sentiment();
  return sentiment.analyze(text);
};
