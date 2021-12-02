const { Router, logger, isAuthenticated, isAuthorized } = require('@senecacdot/satellite');
const Feed = require('../data/feed');
const { getFeeds, getInvalidFeeds, getDelayedFeeds } = require('../storage');
const { validateNewFeed, validateFeedsIdParam } = require('../validation');
const queue = require('../queue');

const feeds = Router();

const feedURL = `${process.env.POSTS_URL}/feeds` || '/';

feeds.get('/', async (req, res, next) => {
  let ids;

  try {
    ids = await getFeeds();
  } catch (error) {
    logger.error({ error }, 'Unable to get feeds from Redis');
    next(error);
  }

  res.set('X-Total-Count', ids.length);
  res.json(
    ids
      // Return id and url for a specific feed
      .map((id) => ({
        id,
        url: `${feedURL}/${id}`,
      }))
  );
});

feeds.get('/invalid', async (req, res, next) => {
  let invalidFeeds;
  try {
    invalidFeeds = await getInvalidFeeds();
  } catch (error) {
    logger.error({ error }, 'Unable to get invalid feeds from Redis');
    return next(error);
  }
  res.set('X-Total-Count', invalidFeeds.length);
  return res.json(
    invalidFeeds.map((element) => ({
      ...element,
      url: `${feedURL}/${element.id}`,
    }))
  );
});

feeds.get('/delayed', async (req, res, next) => {
  let delayedFeeds;
  try {
    delayedFeeds = await getDelayedFeeds();
  } catch (error) {
    logger.error({ error }, 'Unable to get delayed feeds from Redis');
    return next(error);
  }
  res.set('X-Total-Count', delayedFeeds.length);
  return res.json(
    delayedFeeds.map((element) => ({
      ...element,
      url: `${feedURL}/${element.id}`,
    }))
  );
});

feeds.get('/info', async (req, res, next) => {
  try {
    const [jobCnt, queueInfo] = await Promise.all([queue.count(), queue.getJobCounts()]);
    queueInfo.jobCnt = jobCnt;
    res.json({ queueInfo });
  } catch (error) {
    logger.error({ error }, 'Unable to get information from feed-queue');
    next(error);
  }
});

feeds.get('/:id', validateFeedsIdParam(), async (req, res, next) => {
  const { id } = req.params;

  try {
    // If the object we get back is empty, use 404
    const feed = await Feed.byId(id);
    if (!feed) {
      res.status(404).json({
        message: `Feed not found for id ${id}`,
      });
    } else {
      res.json(feed);
    }
  } catch (error) {
    logger.error({ error }, 'Unable to get feeds from Redis');
    next(error);
  }
});

feeds.put(
  '/:id/flag',
  isAuthenticated(),
  isAuthorized((req, user) => {
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  validateFeedsIdParam(),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const feed = await Feed.byId(id);
      if (!feed) {
        return res.status(404).json({
          message: `Feed for Feed ID ${id} doesn't exist.`,
        });
      }
      await feed.flag();
      return res.status(200).json({
        message: `Feed successfully flagged`,
      });
    } catch (error) {
      logger.error({ error }, 'Unable to flag feed in Redis');
      return next(error);
    }
  }
);

feeds.post(
  '/',
  isAuthenticated(),
  isAuthorized(
    // A Seneca user can create a new Telescope user, but an existing Telescope
    // user cannot, since they must already have one.
    (req, user) => user.roles.includes('seneca') && !user.roles.includes('telescope')
  ),
  validateNewFeed(),
  async (req, res, next) => {
    const feedData = req.body;
    const { user } = req;
    feedData.user = user.id;
    try {
      if (!(feedData.url && feedData.author)) {
        return res.status(400).json({ message: `URL and Author must be submitted` });
      }
      if (await Feed.byUrl(feedData.url)) {
        return res.status(409).json({ message: `Feed for url ${feedData.url} already exists.` });
      }
      const feedId = await Feed.create(feedData);
      return res
        .status(201)
        .json({ message: `Feed was successfully added.`, id: feedId, url: `/feeds/${feedId}` });
    } catch (error) {
      logger.error({ error }, 'Unable to add feed to Redis');
      return next(error);
    }
  }
);

feeds.delete(
  '/cache',
  isAuthenticated(),
  isAuthorized((req, user) => {
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  async (req, res, next) => {
    try {
      await Feed.clearCache();
      return res.status(204).send();
    } catch (error) {
      logger.error({ error }, 'Unable to reset Feed data in Redis');
      return next(error);
    }
  }
);

feeds.delete(
  '/:id',
  validateFeedsIdParam(),
  isAuthenticated(),
  isAuthorized(
    // A Seneca user can create a new Telescope user, but an existing Telescope
    // user cannot, since they must already have one.
    (req, user) => user.roles.includes('seneca') && !user.roles.includes('telescope')
  ),
  async (req, res, next) => {
    const { user } = req;
    const { id } = req.params;
    try {
      const feed = await Feed.byId(id);
      if (!feed) {
        return res.status(404).json({ message: `Feed for Feed ID ${id} doesn't exist.` });
      }
      if (!user.owns(feed)) {
        return res.status(403).json({ message: `User does not own this feed.` });
      }
      await feed.delete();
      return res.status(204).json({ message: `Feed ${id} was successfully deleted.` });
    } catch (error) {
      logger.error({ error }, 'Unable to delete feed to Redis');
      return next(error);
    }
  }
);

feeds.delete(
  '/:id/flag',
  isAuthenticated(),
  isAuthorized((req, user) => {
    // Or an admin, or another authorized microservice
    return user.roles.includes('admin') || user.roles.includes('service');
  }),
  validateFeedsIdParam(),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const feed = await Feed.byId(id);
      if (!feed) {
        return res.status(404).json({ message: `Feed for Feed ID ${id} doesn't exist.` });
      }
      await feed.unflag();
      return res.status(204).json({ message: `Feed ${id} was successfully unflagged.` });
    } catch (error) {
      logger.error({ error }, 'Unable to unflag feed in Redis');
      return next(error);
    }
  }
);

module.exports = feeds;
