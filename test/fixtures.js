const nock = require('nock');
const fs = require('fs');
const path = require('path');

/**
 * This is a fixture module for telescope tests which contains measures to
 * maintain a reproducible environment for system testing
 */

const getAtomUri = () => 'https://test321.blogspot.com/feeds/posts/default/-/open-source';
const getRssUri = () => 'https://test321.blogspot.com/feeds/posts/default/-/open-source?alt=rss';
const getHtmlUri = () => 'https://test321.blogspot.com/blog';
// Remove leading protocol from a URI
const stripProtocol = (uri) => uri.replace(/^https?:\/\//, '');

// Use blog.humphd.org as a more realistic test case
const getRealWorldRssUri = () => 'https://blog.humphd.org/tag/seneca/rss/';
const getRealWorldRssBody = () =>
  fs.readFileSync(path.join(__dirname, './test_files/blog.humphd.org.rss'));

// Portion of https://www.feedforall.com/sample.xml
const getValidFeedBody = () =>
  `
  <?xml version="1.0" encoding="windows-1252"?>
  <rss version="2.0">
    <channel>
      <title>FeedForAll Sample Feed</title>
      <description>RSS is a fascinating technology. The uses for RSS are expanding daily. Take a closer look at how various industries are using the benefits of RSS in their businesses.</description>
      <link>http://www.feedforall.com/industry-solutions.htm</link>
      <category domain="www.dmoz.com">Computers/Software/Internet/Site Management/Content Management</category>
      <copyright>Copyright 2004 NotePage, Inc.</copyright>
      <docs>http://blogs.law.harvard.edu/tech/rss</docs>
      <language>en-us</language>
      <lastBuildDate>Tue, 19 Oct 2004 13:39:14 -0400</lastBuildDate>
      <managingEditor>marketing@feedforall.com</managingEditor>
      <pubDate>Tue, 19 Oct 2004 13:38:55 -0400</pubDate>
      <webMaster>webmaster@feedforall.com</webMaster>
      <generator>FeedForAll Beta1 (0.0.1.8)</generator>
      <image>
        <url>http://www.feedforall.com/ffalogo48x48.gif</url>
        <title>FeedForAll Sample Feed</title>
        <link>http://www.feedforall.com/industry-solutions.htm</link>
        <description>FeedForAll Sample Feed</description>
        <width>48</width>
        <height>48</height>
      </image>
      <item>
        <title>RSS Solutions for Restaurants</title>
        <description>&lt;b&gt;FeedForAll &lt;/b&gt;helps Restaurant&apos;s communicate with customers. Let your customers know the latest specials or events.&lt;br&gt;
  &lt;br&gt;
  RSS feed uses include:&lt;br&gt;
  &lt;i&gt;&lt;font color=&quot;#FF0000&quot;&gt;Daily Specials &lt;br&gt;
  Entertainment &lt;br&gt;
  Calendar of Events &lt;/i&gt;&lt;/font&gt;</description>
        <link>http://www.feedforall.com/restaurant.htm</link>
        <category domain="www.dmoz.com">Computers/Software/Internet/Site Management/Content Management</category>
        <comments>http://www.feedforall.com/forum</comments>
        <pubDate>Tue, 19 Oct 2004 11:09:11 -0400</pubDate>
      </item>
      <item>
        <title>RSS Solutions for Schools and Colleges</title>
        <description>FeedForAll helps Educational Institutions communicate with students about school wide activities, events, and schedules.&lt;br&gt;
  &lt;br&gt;
  RSS feed uses include:&lt;br&gt;
  &lt;i&gt;&lt;font color=&quot;#0000FF&quot;&gt;Homework Assignments &lt;br&gt;
  School Cancellations &lt;br&gt;
  Calendar of Events &lt;br&gt;
  Sports Scores &lt;br&gt;
  Clubs/Organization Meetings &lt;br&gt;
  Lunches Menus &lt;/i&gt;&lt;/font&gt;</description>
        <link>http://www.feedforall.com/schools.htm</link>
        <category domain="www.dmoz.com">Computers/Software/Internet/Site Management/Content Management</category>
        <comments>http://www.feedforall.com/forum</comments>
        <pubDate>Tue, 19 Oct 2004 11:09:09 -0400</pubDate>
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

const getInvalidDescription = () =>
  `
  <p>     </p>
  <p>   <br><br><br><br><br></p>
  <p>    </p>
  <p>     </p>
  <p>      </p>
  <p></p>
  `;

/**
 * Generic network nock request, used below to define all our mock requests.
 *
 * @param {String} uri - the full, absolute URL to use for this mock network request
 * @param {String} body  - the body to return
 * @param {Number} httpResponseCode - the HTTP result code
 * @param {String} mimeType  - the mime type to use for the response
 */
function nockResponse(uri, body, httpResponseCode, mimeType, headers) {
  const { protocol, host, pathname, search } = new URL(uri);
  nock(`${protocol}//${host}`)
    .get(`${pathname}${search || ''}`)
    .reply(httpResponseCode, body, {
      'Content-Type': mimeType,
      ...headers,
    });
}

exports.getAtomUri = getAtomUri;
exports.getRssUri = getRssUri;
exports.getHtmlUri = getHtmlUri;
exports.getRealWorldRssUri = getRealWorldRssUri;
exports.stripProtocol = stripProtocol;
exports.getInvalidDescription = getInvalidDescription;

exports.getValidFeedBody = getValidFeedBody;
exports.getEmptyFeedBody = getEmptyFeedBody;
exports.getValidHtmlBody = getValidHtmlBody;

exports.nockValidAtomResponse = function (headers = {}) {
  nockResponse(getAtomUri(), getValidFeedBody(), 200, 'application/rss+xml', headers);
};

exports.nockValidRssResponse = function (headers = {}) {
  nockResponse(getRssUri(), getValidFeedBody(), 200, 'application/rss+xml', headers);
};

exports.nockInvalidRssResponse = function (headers = {}) {
  nockResponse(getRssUri(), getEmptyFeedBody(), 200, 'application/rss+xml', headers);
};

exports.nockValidHtmlResponse = function (headers = {}) {
  nockResponse(getHtmlUri(), getValidHtmlBody(), 200, 'text/html', headers);
};

exports.nock404Response = function (headers = {}) {
  nockResponse(getHtmlUri(), 'Not Found', 404, 'text/html', headers);
};

exports.nockRealWorldRssResponse = function (headers = {}) {
  nockResponse(getRealWorldRssUri(), getRealWorldRssBody(), 200, 'application/rss+xml', headers);
};

exports.createMockJobObjectFromFeedId = (id) => ({ data: { id } });
