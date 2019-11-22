const nock = require('nock');
const fixtures = require('./fixtures');
const feedParser = require('../src/feed-parser');

/**
 * feedParser(feed) async function returning an object if the feed URI is correct and there are
 * things to parse. Invalid URI or non-feed URI should throw an error.
 */

test('passing a valid Atom feed URI and getting title of first post', async () => {
  const feedURL = fixtures.testAtomUri();
  fixtures.nockValidAtomRes();
  const data = await feedParser(feedURL);
  expect(data[data.length - 1].title).toBe('XML Tutorial');
});

test('Passing an invalid ATOM feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source')).rejects.toThrow(
    'error'
  );
});

test('Passing a valid RSS feed URI and getting title of first post', async () => {
  const feedURL = fixtures.testRssUri();
  fixtures.nockValidRssRes();
  const data = await feedParser(feedURL);
  expect(data[data.length - 1].title).toBe('XML Tutorial');
});

test('Passing an invalid RSS feed URI should error', async () => {
  await expect(
    feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss')
  ).rejects.toThrow('error');
});

test('Passing a valid URI, but not a feed URI should error', async () => {
  await expect(feedParser('https://google.ca')).rejects.toThrow('Not a feed');
});

test('Passing an IP address instead of a URI should throw an error', async () => {
  await expect(feedParser('128.190.222.135')).rejects.toThrow('error');
});

test('Passing an invalid RSS category feed should return an empty array', async () => {
  const feedURL = fixtures.testRssUri();
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source?alt=rss')
    .reply(
      200,
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel></channel></rss>'
    );
  const data = await feedParser(feedURL);
  expect(data.length).toBe(0);
});

test('Passing a valid RSS category feed should return an array that is not empty', async () => {
  const feedURL = fixtures.testRssUri();
  fixtures.nockValidRssRes();
  const data = await feedParser(feedURL);
  expect(data.length > 0).toBe(true);
});

test('Non existent feed failure case: 404', async () => {
  expect.assertions(1);

  nock('http://doesnotexist.com')
    .get('/no/such/feed')
    .reply(404, 'Not Found');

  try {
    await feedParser('http://doesnotexist.com/no/such/feed');
  } catch (err) {
    expect(err).toBeTruthy();
  }
});

test('Not a feed failure case: html vs. xml', async () => {
  expect.assertions(1);

  nock('http://doesnotexist.com')
    .get('/html/response')
    .reply(
      200,
      '<!DOCTYPE html><html><head><title>HTML Page</title></head><body>HTML, NOT XML</body></html>',
      {
        'Content-Type': 'text/html',
      }
    );

  try {
    await feedParser('http://doesnotexist.com/html/response');
  } catch (err) {
    expect(err).toBeTruthy();
  }
});
