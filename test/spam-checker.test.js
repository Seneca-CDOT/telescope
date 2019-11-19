const feedparser = require('feedparser-promised');
const checkForSpam = require('../src/spam-checker');

const url = 'https://telescopetestblog.blogspot.com/feeds/posts/default?alt=rss';

describe('Spam detection checks', () => {
  // Running checkIfSpam() on each item returned by feedparser.parse(url)
  // should return false, true, true, true in that order

  let parsedContent;

  beforeAll(async () => {
    parsedContent = await feedparser.parse(url);
  });

  test('Should return true on first post (spam, title is detected as spam by spam-filter)', async () => {
    checkForSpam(parsedContent[0]).then(result => {
      expect(result).toBe(true);
    });
  });

  test('Should return false on second post (not spam)', async () => {
    checkForSpam(parsedContent[1]).then(result => {
      expect(result).toBe(false);
    });
  });

  test('Should return true on third post (spam, no title)', async () => {
    checkForSpam(parsedContent[2]).then(result => {
      expect(result).toBe(true);
    });
  });

  test('Should return true on fourth post (spam, all caps)', async () => {
    checkForSpam(parsedContent[3]).then(result => {
      expect(result).toBe(true);
    });
  });

  test('Should return true on fifth post (spam, less than 5 words)', async () => {
    checkForSpam(parsedContent[4]).then(result => {
      expect(result).toBe(true);
    });
  });
});
