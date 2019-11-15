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
    expect(checkForSpam(parsedContent[0])).toBe(true);
  });

  test('Should return false on second post (not spam)', async () => {
    expect(checkForSpam(parsedContent[1])).toBe(false);
  });

  test('Should return true on third post (spam, no title)', async () => {
    expect(checkForSpam(parsedContent[2])).toBe(true);
  });

  test('Should return true on fourth post (spam, all caps)', async () => {
    expect(checkForSpam(parsedContent[3])).toBe(true);
  });

  test('Should return true on fifth post (spam, less than 5 words)', async () => {
    expect(checkForSpam(parsedContent[4])).toBe(true);
  });
});
