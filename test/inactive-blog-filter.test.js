const fs = require('fs');
const inactiveFilter = require('../src/inactive-blog-filter');

const redlist = JSON.parse(fs.readFileSync('feeds-redlist.json', 'utf8'));

describe('Redlisted feed checking', () => {
  it('should return false for bad feed URLs', async () => {
    const badURLs = [redlist[0].url.slice(0, -1), '', undefined];
    badURLs.forEach((url) => {
      inactiveFilter.check(url, (callback, result) => {
        expect(result).toBe(false);
      });
    });
  });

  it('should return true for all feed URLs in feeds-redlist.json', async () => {
    redlist.forEach((feed) => {
      inactiveFilter.check(feed.url, (callback, result) => {
        expect(result).toBe(true);
      });
    });
  });
});
