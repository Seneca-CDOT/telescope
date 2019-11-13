const { SummarizerManager } = require('node-summarizer');

module.exports = async function (text, numSentences = 3) {
  const summarizer = new SummarizerManager(text, numSentences);
  return summarizer.getSummaryByRank().then(
    (summaryObject) => Promise.resolve(summaryObject.summary),
  );
};
