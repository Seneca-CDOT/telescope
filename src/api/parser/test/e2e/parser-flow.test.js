const { hash, logger, Satellite } = require('@senecacdot/satellite');
const normalizeUrl = require('normalize-url');

const { loadFeedsIntoQueue, invalidateFeed } = require('../../src/parser');
const feedWorker = require('../../src/feed/worker');
const { feedQueue } = require('../../src/feed/queue');
const { addFeeds, getInvalidFeeds, getAllFeeds } = require('../../src/utils/supabase');

const urlToId = (url) => hash(normalizeUrl(url));

// resolve once feedQueue has finished processing all jobs
const waitForDrained = () =>
  new Promise((resolve) => {
    feedQueue.on('drained', () => resolve());
  });

const processFeeds = () => {
  feedQueue.on('failed', (job, err) => {
    invalidateFeed(job.data.id, err).catch((error) =>
      logger.error({ error }, 'Unable to invalidate feed')
    );
  });
  return feedWorker.start();
};

let satellite;
const valid = [
  {
    author: 'Tue Nguyen',
    url: 'http://localhost:8888/feed.xml',
  },
];
const invalid = [
  {
    author: 'John Doe',
    url: 'https://johnhasinvalidfeed.com/feed',
  },
  {
    author: 'Jane Doe',
    url: 'https://janehasinvalidfeed.com/feed',
  },
];
beforeAll(async () => {
  satellite = new Satellite();
  await feedQueue.empty(); // remove jobs from the queue
  await addFeeds([...valid, ...invalid]);
  await processFeeds(); // start the feed queue for e2e test
});

afterAll(() => Promise.all([feedQueue.close(), satellite.stop()]));
describe("Testing parser service's flow", () => {
  test('Parser should process 1 valid feed and 2 invalid feeds', async () => {
    loadFeedsIntoQueue();
    await waitForDrained();
    const allFeeds = await getAllFeeds();
    const invalidFeeds = await getInvalidFeeds();
    const invalidIds = invalid.map((feed) => urlToId(feed.url));

    expect(allFeeds.length).toBe(3);
    expect(invalidFeeds.length).toBe(2);
    expect(invalidIds.includes(invalidFeeds[0].id)).toBe(true);
    expect(invalidIds.includes(invalidFeeds[1].id)).toBe(true);
  });
});
