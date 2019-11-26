const fixtures = require('./fixtures');
const feedParser = require('../src/feed-parser');

/**
 * feedParser(feed) async function returning an object if the feed URI is correct and there are
 * things to parse. Invalid URI or non-feed URI should throw an error.
 */

test('passing a valid Atom feed URI and getting title of first post', async () => {
  const feedURL = fixtures.getAtomUri();
  fixtures.nockValidAtomResponse();
  const data = await feedParser(feedURL);
  expect(data[data.length - 1].title).toBe('XML Tutorial');
});

test('Passing an invalid ATOM feed URI should error', async () => {
  const url = fixtures.stripProtocol(fixtures.getAtomUri());
  await expect(feedParser(url)).rejects.toThrow();
});

test('Passing a valid RSS feed URI and getting title of first post', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockValidRssResponse();
  const data = await feedParser(feedURL);
  expect(data[data.length - 1].title).toBe('XML Tutorial');
});

test('Passing an invalid RSS feed URI should error', async () => {
  const url = fixtures.stripProtocol(fixtures.getRssUri());
  await expect(feedParser(url)).rejects.toThrow();
});

test('Passing a valid URI, but not a feed URI should error', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nockValidHtmlResponse();
  await expect(feedParser(url)).rejects.toThrow();
});

test('Passing an IP address instead of a URI should throw an error', async () => {
  await expect(feedParser('128.190.222.135')).rejects.toThrow();
});

test('Passing an invalid RSS category feed should return an empty array', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockInvalidRssResponse();
  const data = await feedParser(feedURL);
  expect(data.length).toBe(0);
});

test('Passing a valid RSS category feed should return an array that is not empty', async () => {
  const feedURL = fixtures.getRssUri();
  fixtures.nockValidRssResponse();
  const data = await feedParser(feedURL);
  expect(data.length > 0).toBe(true);
});

test('Non existent feed failure case: 404', async () => {
  const url = fixtures.getHtmlUri();
  fixtures.nock404Response();
  await expect(feedParser(url)).rejects.toThrow();
});
