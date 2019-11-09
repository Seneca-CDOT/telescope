// Measure reading level of a text
const { readingLevel } = require('reading-level');

// This function provides basic text analysis
// The number of words, Readability of text, Aproximate Reading Time

module.exports = function analyzeText(text_) {
  // private data members
  // score is Flench-Kincaid Grade Score
  let textInfo;
  let wordCount;
  let score;
  let readability;
  let readingTime;

  // private member functions
  function setReadabilityLevel(score_) {
    let result;
    if (score_ <= 100 && score_ > 70) {
      result = 'easy'; // 5 - 7th grade in public shcool
    } else if (score_ > 50) {
      result = 'normal'; // 8 - 12th grade in public school
    } else if (score_ < 50 && score_ >= 0) {
      result = 'hard'; // Above College level
    } else {
      result = '';
    }
    return result;
  }

  function setReadingTime(wordCount_, readability_) {
    let wpm = 250; // the average reading speed in English
    // https://www.irisreading.com/average-reading-speed-in-various-languages/
    switch (readability_) {
      case 'easy':
        wpm *= 1.2;
        break;
      case 'hard':
        wpm *= 0.8;
        break;
      default:
        break;
    }
    const result = Math.round(wordCount_ / wpm);
    return result;
  }

  // initialize values
  if (typeof text_ === 'string') {
    if (text_.length !== 0) {
      textInfo = readingLevel(text_, 'full');
      wordCount = textInfo.words;
      score = textInfo.rounded; // Flench-Kincaid Grade Score
      readability = setReadabilityLevel(score);
      readingTime = setReadingTime(wordCount, readability);
    } else {
      textInfo = 'Empty Text!';
    }
  } else {
    textInfo = 'Not Vaild Text Input!';
  }

  const isValidString = textInfo !== 'Empty Text!' && textInfo !== 'Not Vaild Text Input!';
  const analysis = {};

  if (isValidString) {
    analysis.wordCount = wordCount;
    analysis.readability = readability;
    analysis.readingTime = readingTime;
  }

  // public member functions

  // synchronize version
  // to get a basic analysis information, getAsyAnalysis should be called
  this.getAnalysis = () => {
    const result = isValidString ? analysis : textInfo;
    return result;
  };

  // asynchonize function
  // to get a basic analysis information, getAsyAnalysis should be called
  this.getAsyAnalysis = async function () {
    return new Promise((res, rej) => {
      if (isValidString) {
        res(analysis);
      } else {
        rej(textInfo);
      }
    });
  };

  return this;
};
