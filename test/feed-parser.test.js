const FeedParser = require('../src/feed-parser');

let parser;

beforeEach(() => {
  parser = new FeedParser();
});

// utility method to check that parse does
// indeed return an non-empty array.
const assertValidFeed = (feed) => {
  expect(Array.isArray(feed)).toBeTruthy();
  expect(feed.length > 0).toBeTruthy();
};


test('Non existant feed failure case.', async () => {
  try {
    await parser.parse('http://doesnotexists___.com');
  } catch (err) {
    expect(err.message).toBe('That URL does not exist.');
  }
});

test('Not a feed failure case', async () => {
  try {
    const nonFeedURL = 'https://kerleysblog.blogspot.com';
    await parser.parse(nonFeedURL);
  } catch (err) {
    expect(/.*That URL is not a valid feed.*/.test(err.message)).toBeTruthy();
  }
});


test('Unrecognized error case', async () => {
  const fakeParser = {
    parse: () => {
      throw new Error('Unrecognized error.');
    },
  };
  parser.injectParser(fakeParser);
  try {
    await parser.parse('some url');
  } catch (err) {
    expect(err.message).toBe('Unrecognized error.');
  }
});


test('Blogger feed success case', async () => {
  const validFeed = 'https://kerleysblog.blogspot.com/feeds/posts/default?alt=rss';
  const feed = await parser.parse(validFeed);
  assertValidFeed(feed);
});

test('Wordpress site feed success case', async () => {
  const validFeed = 'https://medium.com/feed/@Medium';
  const feed = await parser.parse(validFeed);
  assertValidFeed(feed);
});
