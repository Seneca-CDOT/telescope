const fixtures = require('./fixtures');
const processor = require('../src/backend/feed/processor');

test('Passing a valid Atom feed URI should pass', async () => {
  const feedURL = fixtures.getAtomUri();
  fixtures.nockValidAtomResponse();
  const job = fixtures.createMockJobObjectFromURL(feedURL);
  await expect(processor(job)).resolves.toBeTruthy();
});

test('Passing a valid RSS feed URI should pass', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockValidRssResponse();
  const job = fixtures.createMockJobObjectFromURL(feedURL);
  await expect(processor(job)).resolves.toBeTruthy();
});

test('Passing a valid URI with HTML response should return an empty Array', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nockValidHtmlResponse();
  const job = fixtures.createMockJobObjectFromURL(url);
  const result = await processor(job);
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(0);
});

test('Passing an invalid RSS category feed should pass', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockInvalidRssResponse();
  const job = fixtures.createMockJobObjectFromURL(feedURL);
  await expect(processor(job)).resolves.toBeTruthy();
});

test('Passing a valid RSS category feed should pass', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockValidRssResponse();
  const job = fixtures.createMockJobObjectFromURL(feedURL);
  await expect(processor(job)).resolves.toBeTruthy();
});

test('Non existent feed failure case: 404 should return an empty Array', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nock404Response();
  const job = fixtures.createMockJobObjectFromURL(url);
  const result = await processor(job);
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(0);
});
