const inactiveFilter = require('../src/backend/utils/inactive-blog-filter');
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

describe('Testing dateDiff function', () => {
  it('dateDiff should return a positive value if postDate(parameter) is before currentDate', () => {
    expect(inactiveFilter.dateDiff(Date.now() - 1)).toBeGreaterThan(0);
  });

  it('dateDiff should return a negative value if postDate(parameter) is after currentDate', () => {
    expect(inactiveFilter.dateDiff(Date.now() + 1)).toBeLessThan(0);
  });

  it('dateDiff should return a zero value if postDate(parameter) is the same as currentDate', () => {
    expect(inactiveFilter.dateDiff(Date.now())).toEqual(0);
  });
});
