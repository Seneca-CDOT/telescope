const nock = require('nock');

/**
 * This is a fixture module for telescope tests which contains measures to
 * maintain a reproducible environment for system testing
 */

const validBody =
  '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>W3Schools Home Page</title><link>https://www.w3schools.com</link><description>Free web building tutorials</description><item><title>RSS Tutorial</title><link>https://www.w3schools.com/xml/xml_rss.asp</link><description>New RSS tutorial on W3Schools</description></item><item><title>XML Tutorial</title><link>https://www.w3schools.com/xml</link><description>New XML tutorial on W3Schools</description></item></channel></rss>';

const atomUri = 'https://test321.blogspot.com/feeds/posts/default/-/open-source';

const rssUri = 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';

exports.testAtomUri = function() {
  return atomUri;
};

exports.testRssUri = function() {
  return rssUri;
};

exports.nockValidAtomRes = function() {
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source')
    .reply(200, validBody);
};

exports.nockValidRssRes = function() {
  nock('https://test321.blogspot.com')
    .get('/feeds/posts/default/-/open-source?alt=rss')
    .reply(200, validBody);
};
