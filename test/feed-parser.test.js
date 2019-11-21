const nock = require('nock');
const feedParser = require('../src/feed-parser');

/**
 * feedParser(feed) async function returning an object if the feed URI is correct and there are
 * things to parse. Invalid URI or non-feed URI should throw an error.
 */

test('passing a valid Atom feed URI and getting title of first post', async () => {
  const feedURL = 'https://test321.blogspot.com/feeds/posts/default/-/open-source';
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source')
    .reply(
      200,
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>W3Schools Home Page</title><link>https://www.w3schools.com</link><description>Free web building tutorials</description><item><title>RSS Tutorial</title><link>https://www.w3schools.com/xml/xml_rss.asp</link><description>New RSS tutorial on W3Schools</description></item><item><title>XML Tutorial</title><link>https://www.w3schools.com/xml</link><description>New XML tutorial on W3Schools</description></item></channel></rss>'
    );
  const data = await feedParser(feedURL);
  expect(data[data.length - 1].title).toBe('XML Tutorial');
});

test('Passing an invalid ATOM feed URI should error', async () => {
  await expect(feedParser('c3ho.blogspot.com/feeds/posts/default/-/open-source')).rejects.toThrow(
    'error'
  );
});

test('Passing a valid RSS feed URI and getting title of first post', async () => {
  const feedURL = 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source?alt=rss')
    .reply(
      200,
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>W3Schools Home Page</title><link>https://www.w3schools.com</link><description>Free web building tutorials</description><item><title>RSS Tutorial</title><link>https://www.w3schools.com/xml/xml_rss.asp</link><description>New RSS tutorial on W3Schools</description></item><item><title>XML Tutorial</title><link>https://www.w3schools.com/xml</link><description>New XML tutorial on W3Schools</description></item></channel></rss>'
    );
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

test.skip('Passing an invalid RSS category feed should return an empty array', async () => {
  const feedURL = 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source?alt=rss')
    .reply(
      200,
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel></channel></rss>'
    );
  const data = await feedParser(feedURL);
  expect(data.length).toBe(0);
});

test.skip('Passing a valid RSS category feed should return an array that is not empty', async () => {
  const feedURL = 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source?alt=rss')
    .reply(
      200,
      '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>W3Schools Home Page</title><link>https://www.w3schools.com</link><description>Free web building tutorials</description><item><title>RSS Tutorial</title><link>https://www.w3schools.com/xml/xml_rss.asp</link><description>New RSS tutorial on W3Schools</description></item><item><title>XML Tutorial</title><link>https://www.w3schools.com/xml</link><description>New XML tutorial on W3Schools</description></item></channel></rss>'
    );
  const data = await feedParser(feedURL);
  expect(data.length > 0).toBe(true);
});
