/*
  Function takes a string and returns an object with the following properties:
  sentences, words, syllables, unrounded, rounded
  Also includes an error property if an error is encountered while analyzing the string

  unrounded is a measure of the string's complexity using the Flesch-Kincaid Grade Level Readability Formula.
  rounded is the same measure rounded to the nearest 1

  example without errors:
  input: 'this is a simple sentence'
  return:
  { sentences: 1,
  words: 5,
  syllables: 7,
  unrounded: 2.879999999999999,
  rounded: 3 }

  example with error:
  input: '0120131908 74123987419823'
  return:
  { sentences: 1,
  words: 0,
  syllables: 0,
  unrounded: NaN,
  rounded: NaN,
  error: 'Either no sentences or words, please enter valid text' }
*/

const readingLevel = require('reading-level');

module.exports = async function(content) {
  return readingLevel(content, 'full');
};
