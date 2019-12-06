const nock = require('nock');
const url = require('url');

/**
 * This is a fixture module for telescope tests which contains measures to
 * maintain a reproducible environment for system testing
 */

const getAtomUri = () => 'https://test321.blogspot.com/feeds/posts/default/-/open-source';
const getRssUri = () => 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';
const getHtmlUri = () => 'https://test321.blogspot.com/blog';
// Remove leading protocol from a URI
const stripProtocol = uri => uri.replace(/^https?:\/\//, '');

const getValidFeedBody = () =>
  `
  <?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>W3Schools Home Page</title>
      <link>https://www.w3schools.com</link>
      <description>Free web building tutorials</description>
      <item>
        <title>RSS Tutorial</title>
        <link>https://www.w3schools.com/xml/xml_rss.asp</link>
        <description>New RSS tutorial on W3Schools</description>
      </item>
      <item>
        <title>XML Tutorial</title>
        <link>https://www.w3schools.com/xml</link>
        <description>New XML tutorial on W3Schools</description>
      </item>
    </channel>
  </rss>
  `;

const getEmptyFeedBody = () =>
  `
  <?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel/>
  </rss>
  `;

const getValidHtmlBody = () =>
  `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf8" />
      <title>HTML Page</title>
    </head>
    <body>
      <p>HTML, NOT XML</p>
    </body>
  </html>
  `;

/**
 * Generic network nock request, used below to define all our mock requests.
 *
 * @param {String} uri - the full, absolute URL to use for this mock network request
 * @param {String} body  - the body to return
 * @param {Number} httpResponseCode - the HTTP result code
 * @param {String} mimeType  - the mime type to use for the response
 */
function nockResponse(uri, body, httpResponseCode, mimeType) {
  const { protocol, host, pathname, search } = url.parse(uri);
  nock(`${protocol}//${host}`)
    .get(`${pathname}${search || ''}`)
    .reply(httpResponseCode, body, {
      'Content-Type': mimeType,
    });
}

exports.getAtomUri = getAtomUri;
exports.getRssUri = getRssUri;
exports.getHtmlUri = getHtmlUri;
exports.stripProtocol = stripProtocol;

exports.getValidFeedBody = getValidFeedBody;
exports.getEmptyFeedBody = getEmptyFeedBody;
exports.getValidHtmlBody = getValidHtmlBody;

exports.nockValidAtomResponse = function() {
  nockResponse(getAtomUri(), getValidFeedBody(), 200, 'application/rss+xml');
};

exports.nockValidRssResponse = function() {
  nockResponse(getRssUri(), getValidFeedBody(), 200, 'application/rss+xml');
};

exports.nockInvalidRssResponse = function() {
  nockResponse(getRssUri(), getEmptyFeedBody(), 200, 'application/rss+xml');
};

exports.nockValidHtmlResponse = function() {
  nockResponse(getHtmlUri(), getValidHtmlBody(), 200, 'text/html');
};

exports.nock404Response = function() {
  nockResponse(getHtmlUri(), 'Not Found', 404, 'text/html');
};

exports.createMockJobObjectFromURL = function(feedURL) {
  return { data: { url: feedURL } };
};
