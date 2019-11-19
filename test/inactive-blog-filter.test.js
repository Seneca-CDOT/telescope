const inactiveFilter = require('../src/inactive-blog-filter');
const redlist = require('../feeds-redlist.json');

describe('Redlisted feed checking', () => {
  it('should return false for bad feed URLs', () => {
    const badURLs = [redlist[0].url.slice(0, -1), '', undefined];
    badURLs.forEach(url => {
      inactiveFilter.check(url, (callback, result) => {
        expect(result).toBe(false);
      });
    });
  });

  it('should return true for all feed URLs in feeds-redlist.json', () => {
    redlist.forEach(feed => {
      inactiveFilter.check(feed.url, (callback, result) => {
        expect(result).toBe(true);
      });
    });
  });
});
