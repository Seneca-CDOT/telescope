const feedParser = require('../src/feed-parser');

/**
 * feedParser(feed) async function returning an object if the feed URI is correct and there are
 * things to parse. Invalid URI or non-feed URI should throw an error.
*/
test('passing a valid Atom feed URI and getting title of first post', async () => {
  const data = await feedParser('https://c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss');
  expect(data[data.length - 1].title).toBe('First Post!');
});

test('Passing an invalid ATOM feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source?alt=rss')).rejects.toThrow('error');
});

test('Passing a valid RSS feed URI and getting title of first post', async () => {
  const data = await feedParser('https://c3ho.blogspot.com/feeds/posts/default/-/open-source');
  expect(data[data.length - 1].title).toBe('First Post!');
});

test('Passing an invalid RSS feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source')).rejects.toThrow('error');
});

test('Passing a valid URI, but not a feed URI should error', async () => {
  await expect(feedParser('https://google.ca')).rejects.toThrow('Not a feed');
});

test('Passing an IP address instead of a URI should throw an error', async () => {
  await expect(feedParser('128.190.222.135')).rejects.toThrow('error');
});

test.skip('Passing an invalid RSS category feed should return an empty array', async () => {
  const data = await feedParser('http://en.blog.wordpress.com/category/INVALID_CATEGORY/feed/');
  expect(data.length).toBe(0);
});

test.skip('Passing a valid RSS category feed should return an array that is not empty', async () => {
  const data = await feedParser('http://en.blog.wordpress.com/category/features/feed');
  expect(data.length > 0).toBe(true);
});
