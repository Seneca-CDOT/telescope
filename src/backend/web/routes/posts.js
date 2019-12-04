const express = require('express');
const { getPosts } = require('../../utils/storage');
const { logger } = require('../../utils/logger');

const posts = express.Router();

posts.get('/', async (req, res) => {
  let redisGuids;
  try {
    redisGuids = await getPosts();
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
    return;
  }

  res.json(
    redisGuids
      // Return id and url for a specific post
      .map(guid => ({
        id: guid,
        url: `/post/${encodeURIComponent(guid)}`,
      }))
  );
});

module.exports = posts;
