const fs = require('fs');
const path = require('path');
const inactiveFilter = require('../src/backend/utils/inactive-blog-filter');
const redlist = require('../feeds-redlist.json');
const { logger } = require('../src/backend/utils/logger');

const log = logger.child({ module: 'inactive-blog-filter-test' });
const pathToMockRedList = path.join(__dirname, './test_files/mock-redlist.json');
const deleteMockRedlist = () => {
  try {
    fs.unlinkSync(pathToMockRedList);
  } catch (err) {
    log.error(`failed to delete ${pathToMockRedList}`, err.message);
    throw err;
  }
};
const initializeMockRedlist = () => {
  try {
    fs.writeFileSync(pathToMockRedList, '[]', { flag: 'w' });
  } catch (err) {
    deleteMockRedlist();
    log.error(`failed to write to ${pathToMockRedList}`, err.message);
    throw err;
  }
};

beforeAll(() => {
  initializeMockRedlist();
});

afterAll(() => {
  deleteMockRedlist();
});

describe('Redlisted feed checking', () => {
  it('should return false for bad feed URLs', async () => {
    const badURLs = [redlist[0].url.slice(0, -1), '', undefined];

    badURLs.forEach(async url => {
      await inactiveFilter
        .check(url)
        .then(isRedlisted => {
          expect(isRedlisted).toBe(false);
        })
        .catch(err => {
          log.error(err.message);
          throw err;
        });
    });
  });

  it('should return true for all feed URLs in feeds-redlist.json', async () => {
    redlist.forEach(async feed => {
      await inactiveFilter
        .check(feed.url)
        .then(isRedlisted => {
          expect(isRedlisted).toBe(true);
        })
        .catch(err => {
          log.error(err.message);
          throw err;
        });
    });
  });

  it('should handle being passed a bad filename by rejecting with an error', async () => {
    await expect(inactiveFilter.check(redlist[0].url, null)).rejects.toThrow();
  });

  it('should handle empty redlists by resolving with a false value', async () => {
    await expect(inactiveFilter.check(redlist[0].url, pathToMockRedList)).resolves.toBe(false);
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

describe('Testing of update()', () => {
  beforeEach(() => {
    initializeMockRedlist();
  });

  const pathToActiveFeeds = path.join(
    __dirname,
    './test_files/inactive-blog-filter.test-active-feeds.txt'
  );
  const pathToInactiveFeeds = path.join(
    __dirname,
    './test_files/inactive-blog-filter.test-inactive-feeds.txt'
  );
  const pathToDeadFeeds = path.join(
    __dirname,
    './test_files/inactive-blog-filter.test-dead-feeds.txt'
  );
  const mockFeeds = [
    {
      url: 'https://blog.humphd.org/',
      date: new Date().getTime(),
      status: 'active',
    },
    {
      url: 'http://ajhooper.blogspot.com/feeds/posts/default',
      date: '2008-10-18T17:22:32.366Z',
      status: 'inactive',
    },
    {
      url: 'http://KrazyDre.blogspot.com/feeds/posts/default?alt=rss',
      date: null,
      status: 'dead',
    },
  ];

  function mockFeedParser(feedItem) {
    const feeds = mockFeeds.filter(item => {
      return item.url === feedItem.url;
    });
    return feeds[0].status === 'dead' ? null : feeds;
  }

  it('should not redlist active blogs', async () => {
    return inactiveFilter
      .update(pathToActiveFeeds, pathToMockRedList, mockFeedParser)
      .then(data => {
        expect(data.length).toEqual(0);
      })
      .catch(err => {
        deleteMockRedlist();
        log.error(err.message);
        throw err;
      });
  });

  it('should redlist inactive blogs', async () => {
    const inactiveRedlist = mockFeeds.filter(item => {
      return item.status === 'inactive';
    });
    return inactiveFilter
      .update(pathToInactiveFeeds, pathToMockRedList, mockFeedParser)
      .then(data => {
        expect(data.length).toEqual(inactiveRedlist.length);
        for (let i = 0; i < inactiveRedlist.length; i += 1) {
          expect(data[i].url).toBe(inactiveRedlist[i].url);
        }
      })
      .catch(err => {
        deleteMockRedlist();
        log.error(err.message);
        throw err;
      });
  });

  it('should redlist invalid or dead blogs', async () => {
    const deadRedlist = mockFeeds.filter(item => {
      return item.status === 'dead';
    });
    return inactiveFilter
      .update(pathToDeadFeeds, pathToMockRedList, mockFeedParser)
      .then(data => {
        expect(data.length).toEqual(deadRedlist.length);
        for (let i = 0; i < deadRedlist.length; i += 1) {
          expect(data[i].url).toBe(deadRedlist[i].url);
        }
      })
      .catch(err => {
        deleteMockRedlist();
        log.error(err.message);
        throw err;
      });
  });

  it('should handle an invalid first argument by throwing an error', async () => {
    await expect(inactiveFilter.update('', pathToMockRedList)).rejects.toThrow();
  });

  it('should handle an invalid second argument by throwing an error', async () => {
    await expect(inactiveFilter.update(pathToActiveFeeds, '')).rejects.toThrow();
  });
});
