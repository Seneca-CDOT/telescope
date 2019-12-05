const express = require('express');
const { getPosts, getPostsCount } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const { getPostsCount } = require('../../utils/storage');

const posts = express.Router();

posts.get('/', async (req, res) => {
  let redisGuids;
  let perPage;
  const defaultNumberOfPosts = 30;
  const capNumOfPosts = 100;
  const page = req.query.page || 1;

  if (req.query.per_page)
    perPage = req.query.per_page > capNumOfPosts ? capNumOfPosts : req.query.per_page;
  else perPage = defaultNumberOfPosts;

  try {
    const postsInDB = await getPostsCount();
    const from = perPage * (page - 1);
    const to = perPage * page > postsInDB ? postsInDB : perPage * page;
    redisGuids = await getPosts(from, to);
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
    const count = await getPostsCount();
    res.json(count);
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(500).json({
      message: 'Unable to connect to database',
    });
  }
});

module.exports = posts;
