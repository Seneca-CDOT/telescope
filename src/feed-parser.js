const feedParser = require('feedparser-promised');
// made into a class for easy test mocking.
class FeedParser {
  constructor() {
    this.feedParser = feedParser;
  }

  /**
    Dependency injection to mock the response of feedparser.
  */
  injectParser(parser) {
    this.feedParser = parser;
  }

  async parse(urlFeed) {
    try {
      return await this.feedParser.parse(urlFeed);
    } catch (err) {
      if (/.*ENOTFOUND.*/.test(err.message)) {
        throw new Error('That URL does not exist.');
      } else if (/Not a feed/.test(err.message)) {
        throw new Error('That URL is not a valid feed.');
      } else {
        throw (err);
      }
    } // end catch.
  }
} // end class.

module.exports = FeedParser;
