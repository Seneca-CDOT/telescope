const express = require('express');
const { getPosts } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const { getPostsCount } = require('../../utils/storage');

const posts = express.Router();

posts.get('/', async (req, res) => {
  let redisGuids;
  const defaultNumberOfPosts = 30;
  const capNumOfPosts = 100;
  try {
    req.query.per_page = req.query.per_page || defaultNumberOfPosts;
    redisGuids = await getPosts(
      req.query.per_page > capNumOfPosts ? capNumOfPosts : req.query.per_page
    );
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

posts.get('/count', async (req, res) => {
  try {
    await res.json(getPostsCount());
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(500).json({
      message: 'Unable to connect to database',
    });
  }
});

module.exports = posts;
