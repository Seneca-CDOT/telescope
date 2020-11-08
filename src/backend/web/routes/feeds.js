const express = require('express');
const Feed = require('../../data/feed');
const { getFeeds } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const { protect } = require('../authentication');
const { protectAdmin } = require('../authentication');
const Ajv = require('ajv');

const feeds = express.Router();
const feedSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['url', 'author'],
  items: {
    id: 'string',
    author: 'string',
    url: 'string',
    user: 'string',
    link: 'string',
    etag: 'string',
    lastModified: 'string',
  },
};
const ajv = new Ajv();
const feedTest = ajv.compile(feedSchema);

feeds.get('/', async (req, res) => {
  let ids;

  try {
    ids = await getFeeds();
  } catch (error) {
    logger.error({ error }, 'Unable to get feeds from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
    return;
  }

  res.set('X-Total-Count', ids.length);
  res.json(
    ids
      // Return id and url for a specific feed
      .map((id) => ({
        id,
        url: `/feeds/${id}`,
      }))
  );
});

feeds.get('/:id', async (req, res) => {
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
    res.status(503).json({
      message: 'Unable to connect to database',
    });
  }
});

feeds.put('/:id/flag', protectAdmin(), async (req, res) => {
  const isValid = feedTest(req.body);
  if (!isValid) {
    return res.status(400).json({ message: feedTest.errors });
  }
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
    return res.status(503).json({
      message: 'Unable to flag Feed',
    });
  }
});

feeds.post('/', protect(), async (req, res) => {
  const isValid = feedTest(req.body);
  if (!isValid) {
    return res.status(400).json({ message: feedTest.errors });
  }

  const feedData = req.body;
  const { user } = req;
  feedData.user = user.id;
  try {
    // if (!(feedData.url && feedData.author)) {
    //   return res.status(400).json({ message: `URL and Author must be submitted` });
    // }
    if (await Feed.byUrl(feedData.url)) {
      return res.status(409).json({ message: `Feed for url ${feedData.url} already exists.` });
    }
    const feedId = await Feed.create(feedData);
    return res
      .status(201)
      .json({ message: `Feed was successfully added.`, id: feedId, url: `/feeds/${feedId}` });
  } catch (error) {
    logger.error({ error }, 'Unable to add feed to Redis');
    return res.status(503).json({
      message: 'Unable to add to Feed',
    });
  }
});

feeds.delete('/cache', protectAdmin(true), async (req, res) => {
  const isValid = feedTest(req.body);
  if (!isValid) {
    return res.status(400).json({ message: feedTest.errors });
  }
  try {
    await Feed.clearCache();
    return res.status(204).send();
  } catch (error) {
    logger.error({ error }, 'Unable to reset Feed data in Redis');
    return res.status(503).json({
      message: 'Unable to reset data for Feeds',
    });
  }
});

feeds.delete('/:id', protect(), async (req, res) => {
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
    return res.status(503).json({
      message: 'Unable to delete to Feed',
    });
  }
});

feeds.delete('/:id/flag', protectAdmin(), async (req, res) => {
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
    return res.status(503).json({
      message: 'Unable to unflag Feed',
    });
  }
});

module.exports = feeds;
