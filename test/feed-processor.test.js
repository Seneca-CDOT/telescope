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

test('Passing a valid URI, but not a feed URI should error', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nockValidHtmlResponse();
  const job = fixtures.createMockJobObjectFromURL(url);
  await expect(processor(job)).rejects.toThrow();
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

test('Non existent feed failure case: 404 should error', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nock404Response();
  const job = fixtures.createMockJobObjectFromURL(url);
  await expect(processor(job)).rejects.toThrow();
});
