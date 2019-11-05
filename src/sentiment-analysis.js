/* This file contains the code for analyzing blog posts text to identify the
 * negative or positve words being used in a post and return a summary of it
 * along with a score. The file uses a node module called sentiment to implement
 * the functionality of analyzing text of blogs. The function accepts striped
 * HTML text as parameters i.e text containg no tags, and returns a promise
 * object whcih contains the result
*/

var Sentiment = require('sentiment');
var sentiment = new Sentiment();

module.exports.startAnalysys = function(blogText){
  var result;
   return new Promise(function(resolve,reject){
       result = sentiment.analyze(blogText);
        resolve(result);
    });
};

