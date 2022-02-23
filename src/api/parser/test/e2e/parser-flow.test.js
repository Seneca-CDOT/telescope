const { hash, fetch, logger, Satellite } = require('@senecacdot/satellite');
const normalizeUrl = require('normalize-url');

const { loadFeedsIntoQueue, invalidateFeed } = require('../../src/parser');
const feedWorker = require('../../src/feed/worker');
const { feedQueue } = require('../../src/feed/queue');
const getWikiFeeds = require('../../src/utils/wiki-feed-parser');

const urlToId = (url) => hash(normalizeUrl(url));

jest.mock('../../src/utils/wiki-feed-parser');

const valid = [
  {
    author: 'Tue Nguyen',
    url: 'https://dev.to/feed/tuenguyen2911_67',
  },
  {
    author: 'Antonio Bennett',
    url: 'https://dev.to/feed/antoniobennett',
  },
];
const invalid = [
  {
    author: 'Waqas Khan',
    url: 'http://wkhan10.wordpress.com/feed',
  },
  {
    author: 'Daniel Hodgin',
    url: 'http://www.hodgin.ca/?feed=rss2&cat=4',
  },
];

const fetchData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// return true if check array has all elements that exist in target array
const checker = (target, check) => check.every((value) => target.includes(value));

// resolve once feedQueue has finished processing all jobs
const waitForDrained = () =>
  new Promise((resolve) => {
    feedQueue.on('drained', () => resolve());
  });

const processFeeds = () => {
  // Feed.all() should return empty array => mock getWikiFeeds to return 2 valid feeds
  feedQueue.on('failed', (job, err) =>
    invalidateFeed(job.data.id, err).catch((error) =>
      logger.error({ error }, 'Unable to invalidate feed')
    )
  );
  return feedWorker.start();
};

let satellite;

beforeAll(() => {
  satellite = new Satellite();
  return processFeeds(); // start the feed queue for e2e test
});

afterAll(() => Promise.all([feedQueue.close(), satellite.stop()]));

describe("Testing parser service's flow", () => {
  test('Parser should process 2 valid feeds', async () => {
    getWikiFeeds.mockReturnValue(valid); // Feed.all() should return an empty array => mock getWikiFeeds to return what feeds we want to test
    loadFeedsIntoQueue();
    await waitForDrained();

    const allFeeds = await fetchData(`${process.env.POSTS_URL}/feeds`);
    const validFeeds = await Promise.all(allFeeds.map((feed) => fetchData(feed.url)));
    const validIds = validFeeds.map((feed) => feed.id);

    expect(allFeeds.length).toBeGreaterThan(0);
    expect(
      checker(
        validIds,
        valid.map((elem) => urlToId(elem.url))
      )
    ).toBe(true); // check if feeds from Posts service contains all valid feeds
  });

  test('Parser should process 2 invalid feeds', async () => {
    getWikiFeeds.mockReturnValue(invalid);
    loadFeedsIntoQueue();
    await waitForDrained();

    const feeds = await fetchData(`${process.env.POSTS_URL}/feeds/invalid`);
    const invalidFeeds = await Promise.all(feeds.map((feed) => fetchData(feed.url)));
    const invalidIds = invalidFeeds.map((feed) => feed.id);

    expect(invalidFeeds.length).toBeGreaterThan(0);
    expect(
      checker(
        invalidIds,
        invalid.map((elem) => urlToId(elem.url))
      )
    ).toBe(true); // check if feeds from Posts service contains all invalid feeds
  });
});
