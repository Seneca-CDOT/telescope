const { logger, createError } = require('@senecacdot/satellite');

const { isTwitchUrl, toTwitchFeedUrl, getBlogBody, getFeedUrls } = require('./util');

// A middleware to ensure we get an array
module.exports.checkForArray = () => {
  return (req, res, next) => {
    logger.debug({ body: req.body }, 'Checking body for Array');

    if (Array.isArray(req.body)) {
      return next();
    }
    return next(createError(400, 'Expected Array of URLs'));
  };
};

// A middleware to check if Url provided is valid
module.exports.checkValidUrls = function checkValidUrls() {
  return (req, res, next) => {
    try {
      req.body.forEach((url) => !!new URL(url));
      next();
    } catch (err) {
      // If the URL is invalid, return 400 error
      logger.warn({ err }, 'checkValidUrls failed');
      next(createError(400, 'Invalid Blog URL(s)'));
    }
  };
};

// A middleware to check if the URL is a valid web page, 200 status with text/html type
module.exports.discoverFeedUrls = () => {
  return async (req, res, next) => {
    try {
      logger.debug({ body: req.body }, 'Discovering URLs for Body');
      const feedUrls = await Promise.all(
        req.body.map(async (url) => {
          // Special case for Twitch channels
          if (isTwitchUrl(url)) {
            return {
              feedUrl: toTwitchFeedUrl(url),
              type: 'twitch',
            };
          }

          // Otherwise, try to parse out the feed URL from the body of the page
          const body = await getBlogBody(url);
          if (!body) {
            throw new Error('Unable to get blog');
          }
          return getFeedUrls(body);
        })
      );

      res.locals.feedUrls = feedUrls.flat().filter(Boolean);
      next();
    } catch (err) {
      // if there is err (eg: 404 status), return 400 error
      logger.warn({ err }, 'Error discovering feeds');
      next(createError(400, 'Unable to Check Blog'));
    }
  };
};
