/**
 * https://www.npmjs.com/package/node-summarizer#desc
 */
const { SummarizerManager } = require('node-summarizer');

module.exports = async function(text, numSentences = 3) {
  const summarizer = new SummarizerManager(text, numSentences);
  const summaryByRank = await summarizer.getSummaryByRank();
  return summaryByRank.summary;
};
