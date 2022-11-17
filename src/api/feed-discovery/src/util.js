const got = require('got');
const cheerio = require('cheerio');
const { logger } = require('@senecacdot/satellite');

const isTwitchUrl = (url) => {
  try {
    return new URL(url).host.includes('twitch.tv');
  } catch (err) {
    return false;
  }
};

const toTwitchFeedUrl = (twitchChannelUrl) => {
  // We expect to get something like https://twitch.tv/thanhcvann
  if (module.exports.isTwitchUrl(twitchChannelUrl)) {
    const channelName = twitchChannelUrl.replace(/https?:\/\/twitch.tv\//, '');
    return `${process.env.RSS_BRIDGE_URL}/?action=display&bridge=Twitch&channel=${channelName}&type=all&format=Atom`;
  }

  throw new Error('not a Twitch URL');
};

const isFeedUrl = async (url) => {
  try {
    const { statusCode, headers } = await got(url);
    const contentType = headers['content-type'];
    const validContentTypes = [
      'application/xml',
      'application/rss+xml',
      'application/atom+xml',
      'application/x.atom+xml',
      'application/x-atom+xml',
      'application/json',
      'application/json+oembed',
      'application/xml+oembed',
    ];

    return statusCode === 200 && validContentTypes.some((ct) => contentType.includes(ct));
  } catch (err) {
    return false;
  }
};

const getBlogBody = async (blogUrl) => {
  try {
    logger.debug({ blogUrl }, 'Getting blog body');
    const { statusCode, headers, body } = await got(blogUrl);
    const contentType = headers['content-type'];
    // If status code is not 200 or content-type is not text/html then send 400 error
    if (!(statusCode === 200 && contentType.includes('text/html'))) {
      logger.debug({ statusCode, contentType, blogUrl }, 'Unexpected blog content for blog url');
      return null;
    }
    logger.debug({ body }, 'Got body for blog');
    return body;
  } catch (err) {
    // if there is err (eg: 404 status), return 400 error
    logger.warn({ err, blogUrl }, 'Unable to check blog url');
    return null;
  }
};

// Could be one of YouTube, Twitch, or a regular RSS blog feed
const getFeedUrlType = (feedUrl) => {
  try {
    const urlObject = new URL(feedUrl);
    if (urlObject.host.includes('youtube.com')) {
      return 'youtube';
    }
    if (urlObject.host.includes('twitch.tv')) {
      return 'twitch';
    }
    return 'blog';
  } catch (err) {
    return 'blog';
  }
};

// Helper function to return the feed url of a given blog url
const getFeedUrls = (document) => {
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
        const feedUrl = links[i].attribs.href;
        feedUrls.push({
          feedUrl,
          type: getFeedUrlType(feedUrl),
        });
      }
    }

    return feedUrls;
  } catch (err) {
    logger.warn({ err, document }, 'unable to parse blog');
    return null;
  }
};

module.exports.getFeedUrlType = getFeedUrlType;
module.exports.getBlogBody = getBlogBody;
module.exports.getFeedUrls = getFeedUrls;
module.exports.isTwitchUrl = isTwitchUrl;
module.exports.toTwitchFeedUrl = toTwitchFeedUrl;
module.exports.isFeedUrl = isFeedUrl;
