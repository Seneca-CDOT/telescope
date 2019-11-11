const { SummarizerManager } = require('node-summarizer');

module.exports = async function (text, numSentences = 3) {
  const Summarizer = new SummarizerManager(text, numSentences);
  return Summarizer.getSummaryByRank().then(
    (summaryObject) => Promise.resolve(summaryObject.summary),
  );
};
