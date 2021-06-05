const cheerio = require('cheerio');
const validUrl = require('valid-url');
const { logger, createError, fetch } = require('@senecacdot/satellite');

// A middleware to check if Url provided is valid
module.exports.checkValidUrl = function checkValidUrl() {
  return (req, res, next) => {
    // If the URL is invalid, return 400 error
    if (!validUrl.isUri(req.body.blogUrl)) {
      next(createError(400, 'Invalid Blog URL'));
      return;
    }
    // Else, continue
    next();
  };
};

// A middleware to check if the URL is a valid web page, 200 status with text/html type
module.exports.checkValidBlog = function checkValidBlog() {
  return async (req, res, next) => {
    try {
      const response = await fetch(req.body.blogUrl);
      const contentType = response.headers.get('content-type');
      // If status code is not 200 or content-type is not text/html then send 400 error
      if (!(response.status === 200 && contentType.includes('text/html'))) {
        next(createError(400, 'Invalid Blog'));
        return;
      }
      res.locals.document = response.body;
      next();
    } catch (err) {
      // if there is err (eg: 404 status), return 400 error
      next(createError(400, 'Unable to Check Blog'));
    }
  };
};

// A middleware to discover the feed URL from supplied blog URL
module.exports.discoverFeedUrls = function discoverFeedUrls() {
  // Helper function to return the feed url of a given blog url
  function getFeedUrls(document) {
    try {
      // Load the html document
      const $ = cheerio.load(document);

      const selectors = [
        'link[type="application/rss+xml"]',
        'link[type="application/atom+xml"]',
        'link[type="application/x.atom+xml"]',
        'link[type="application/x-atom+xml"]',
        'link[type="application/json"]',
        'link[type="application/json+oembed"]',
        'link[type="application/xml+oembed"]',
      ].join(',');
      // Extract the Cheerio object of link elements that potentially contains a feed URL
      const links = $(selectors);

      // NOTE: The return of $(...) function would be a Cheerio object with the
      // keys similar to [ '0', '1', 'options', '_root', 'length', 'prevObject' ]. In this
      // case the length will be 2 since there are two elements with a feed url.
      const feedUrls = [];

      if (links.length > 0) {
        for (let i = 0; i < links.length; i += 1) {
          feedUrls.push(links[i].attribs.href);
        }
      }

      return feedUrls;
    } catch (err) {
      logger.warn({ err }, 'unable to parse blog');
      return null;
    }
  }

  return (req, res, next) => {
    const feedUrls = getFeedUrls(res.locals.document);
    if (!feedUrls) {
      next(createError(400, 'Invalid Blog'));
      return;
    }
    if (feedUrls.length === 0) {
      next(createError(404, 'No Feed Url Discovered'));
      return;
    }
    // Reference: https://stackoverflow.com/questions/18875292/passing-variables-to-the-next-middleware-using-next-in-express-js
    res.locals.feedUrls = feedUrls;
    next();
  };
};
