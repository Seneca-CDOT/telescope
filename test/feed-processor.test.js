const fixtures = require('./fixtures');
const processor = require('../src/backend/feed/processor');
const Feed = require('../src/backend/data/feed');

jest.mock('../src/backend/utils/elastic');

describe('Feed Processor Tests', () => {
  const createFeed = (url) =>
    Feed.create({
      author: 'author',
      url,
    });

  test('Passing a valid Atom feed URI should pass', async () => {
    const url = fixtures.getAtomUri();
    const id = await createFeed(url);
    fixtures.nockValidAtomResponse();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });

  test('Passing a valid RSS feed URI should pass', async () => {
    const url = fixtures.getRssUri();
    const id = await createFeed(url);
    fixtures.nockValidRssResponse();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });

  test('Passing a valid URI with HTML response should work', async () => {
    const url = fixtures.getHtmlUri();
    const id = await createFeed(url);
    fixtures.nockValidHtmlResponse();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });

  test('Passing an invalid RSS category feed should pass', async () => {
    const url = fixtures.getRssUri();
    const id = await createFeed(url);
    fixtures.nockInvalidRssResponse();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });

  test('Passing a valid RSS category feed should pass', async () => {
    const url = fixtures.getRssUri();
    const id = await createFeed(url);
    fixtures.nockValidRssResponse();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });

  test('Non existent feed failure case: 404 should work', async () => {
    const url = fixtures.getHtmlUri();
    const id = await createFeed(url);
    fixtures.nock404Response();
    const job = fixtures.createMockJobObjectFromFeedId(id);
    await expect(processor(job)).resolves.not.toBeDefined();
  });
});
