const express = require('express');
const Feed = require('../../data/feed');
const { protect } = require('../authentication');
const { getFeeds } = require('../../utils/storage');
const { logger } = require('../../utils/logger');

const feeds = express.Router();

feeds.get('/', async (req, res) => {
  let ids;

  try {
    ids = await getFeeds();
  } catch (err) {
    logger.error({ err }, 'Unable to get feeds from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
    return;
  }

  res.set('X-Total-Count', ids.length);
  res.json(
    ids
      // Return id and url for a specific feed
      .map(id => ({
        id,
        url: `/feeds/${id}`,
      }))
  );
});

feeds.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const feed = await Feed.byId(id);

    // If the object we get back is empty, use 404
    if (!feed) {
      res.status(404).json({
        message: `Feed not found for id ${id}`,
      });
    } else {
      res.json(feed);
    }
  } catch (err) {
    logger.error({ err }, 'Unable to get feeds from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
  }
});

feeds.post('/', protect, async (req, res) => {
  const { newFeed, email } = req.body;
  try {
    /* check if email has a key in redis
  if not create key
  if user has a key in redis, check if feed already exists, (not sure how fast this is? or if its necessary), if not store feed in feeds.
  */
  } catch (error) {
    logger.error({ error }, 'Unable to add feed to redis');
    res.status(503).json({
      message: 'Unable to add feed to database.',
    });
  }
});

module.exports = feeds;
