const feedparser = require('feedparser-promised');
const checkForSpam = require('../src/check-for-spam');

const url = 'https://telescopetestblog.blogspot.com/feeds/posts/default?alt=rss';

describe('Spam detection checks', () => {
  // Running checkIfSpam() on each item returned by feedparser.parse(url)
  // should return false, true, true, true in that order

  let parsedContent;

  beforeAll(async () => {
    parsedContent = await feedparser.parse(url);
  });

  test('Should return false on first post', async () => {
    expect(checkForSpam(parsedContent[0])).toBe(false);
  });

  test('Should return true on second post', async () => {
    expect(checkForSpam(parsedContent[1])).toBe(true);
  });

  test('Should return true on third post', async () => {
    expect(checkForSpam(parsedContent[2])).toBe(true);
  });

  test('Should return true on fourth post', async () => {
    expect(checkForSpam(parsedContent[3])).toBe(true);
  });
});
