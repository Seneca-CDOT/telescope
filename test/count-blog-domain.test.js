const countBlogDomain = require('../src/backend/utils/count-blog-domain');

const feedUrls = [
  { url: 'https://neilong31.wordpress.com/feed/' },
  { url: 'https://haichuan0424.wordpress.com/feed/' },
  { url: 'https://medium.com/@haichuan0424' },
  { url: 'http://ajhooper.blogspot.com/feeds/posts/default' },
  { url: 'http://ljubomirgorscak.blogspot.com/feeds/posts/default' },
  { url: 'http://nashutzu.blogspot.com/feeds/posts/default' },
  { url: 'http://nadavid.blogspot.com/feeds/posts/default' },
  { url: 'http://gkrilov.blogspot.com/feeds/posts/default' },
  { url: 'http://KrazyDre.blogspot.com/feeds/posts/default?alt=rss' },
  {
    url: 'http://dcucereavii.blogspot.com/feeds/posts/default?alt=rss',
  },
];

const domainCountResult = [
  { name: 'wordpress.com', count: 2 },
  { name: 'medium.com', count: 1 },
  { name: 'blogspot.com', count: 7 },
];

test('Count domains from blog posts', () => {
  expect(countBlogDomain.blogDomainCounter(feedUrls)).toEqual(domainCountResult);
});

test('empty list of Urls', () => {
  expect(countBlogDomain.blogDomainCounter([])).toEqual([]);
});
