const { hash } = require('@senecacdot/satellite');
const normalizeUrl = require('normalize-url');

const urlToId = (url) => hash(normalizeUrl(url));

let feeds = [];
let feedIds = new Set();

module.exports = {
  __resetMockFeeds: () => {
    feeds = [];
    feedIds = new Set();
  },
  /**
   * @param {Array<Feed | { url: string }>} feedObjects
   */
  __setMockFeeds: (feedObjects) => {
    const mockFeeds = feedObjects.reduce((uniqueFeeds, feed) => {
      const id = feed.id || urlToId(feed.url);
      if (!feedIds.has(id)) {
        feedIds.add(id);
        return uniqueFeeds.concat({ id, invalid: false, flagged: false });
      }
      return uniqueFeeds;
    }, []);
    feeds = feeds.concat(mockFeeds);
  },

  // Invalid feed related functions
  setInvalidFeed: (id) => {
    feeds.forEach((feed) => {
      if (feed.id === id) {
        feed.invalid = true;
      }
    });
    return Promise.resolve();
  },
  getInvalidFeeds: () => {
    const invalidFeedIds = feeds.filter((feed) => feed.flagged).map((feed) => ({ id: feed.id }));
    return Promise.resolve(invalidFeedIds);
  },
  isInvalid: (id) => {
    const targetFeed = feeds.find((feed) => feed.id === id);
    return Promise.resolve(!!targetFeed.invalid);
  },
  // Flagged feed related functions
  getAllFeeds: jest.fn().mockImplementation(() => Promise.resolve(feeds)),
  setFlaggedFeed: jest.fn().mockImplementation((id) => {
    feeds.forEach((feed) => {
      if (feed.id === id) {
        feed.flagged = true;
      }
    });
    return Promise.resolve();
  }),
  unsetFlaggedFeed: jest.fn().mockImplementation((id) => {
    feeds.forEach((feed) => {
      if (feed.id === id) {
        feed.flagged = false;
      }
    });
    return Promise.resolve();
  }),

  getFlaggedFeeds: jest.fn().mockImplementation(() => {
    const flaggedFeedIds = feeds.filter((feed) => feed.flagged).map((feed) => feed.id);
    return Promise.resolve(flaggedFeedIds);
  }),
  isFlagged: jest.fn().mockImplementation((id) => {
    const targetFeed = feeds.find((feed) => feed.id === id);
    return Promise.resolve(!!targetFeed.flagged);
  }),
};
