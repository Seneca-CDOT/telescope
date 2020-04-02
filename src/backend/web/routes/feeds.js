const express = require('express');
const Feed = require('../../data/feed');
const { getFeeds } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
// const { protect } = require('../authentication'); https://github.com/Seneca-CDOT/telescope/issues/734

const feeds = express.Router();

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

// add protect here for development. https://github.com/Seneca-CDOT/telescope/issues/734

feeds.post('/', async (req, res) => {
  const feedData = req.body;
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
    return res.status(503).json({
      message: 'Unable to add to Feed',
    });
  }
});

module.exports = feeds;
