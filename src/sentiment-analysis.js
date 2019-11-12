/* This file contains the code for analyzing blog posts text to identify the
 * negative or positve words being used in a post and return a summary of it
 * along with a score. The file uses a node module called sentiment to implement
 * the functionality of analyzing text of blogs. The function accepts plain
 * text as a parameter i.e text containg no HTML tags, and returns a promise
 * object whcih contains the result.
*/
const Sentiment = require('sentiment');

module.exports.run = async function (text) {
  const sentiment = new Sentiment();
  try{
  return Promise.resolve(sentiment.analyze(text));
  }catch(error){
    console.log(error);
  }
};
