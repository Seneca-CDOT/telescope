const express = require('express');
const { getPosts, getPostsCount } = require('../../utils/storage');
const { logger } = require('../../utils/logger');
const { getPostsCount } = require('../../utils/storage');

const posts = express.Router();

posts.get('/', async (req, res) => {
  const defaultNumberOfPosts = 30;
  const capNumOfPosts = 100;
  const page = req.query.page || 1;

  let redisGuids;
  let perPage;
  let postsInDB;
  let from;
  let to;

  /**
   * Set 'perPage' to a value under within the limits or
   * to default if per_page is not present
   */
  if (req.query.per_page)
    perPage = req.query.per_page > capNumOfPosts ? capNumOfPosts : req.query.per_page;
  else perPage = defaultNumberOfPosts;

  try {
    postsInDB = await getPostsCount();

    // Set the range of posts we want to get from our DB
    from = perPage * (page - 1);
    // Make sure the upper limit is not higher than the total number of posts in the DB
    to = perPage * page > postsInDB ? postsInDB : perPage * page;

    redisGuids = await getPosts(from, to);
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
    return;
  }

  const nextPage = to === postsInDB ? 1 : page + 1;
  const prevPage = from === 0 ? postsInDB / perPage : page - 1;

  res.links({
    next: `/posts?per_page=${perPage}&page=${nextPage}`,
    prev: `/posts?per_page=${perPage}&page=${prevPage}`,
    first: `/posts?per_page=${perPage}&page=${1}`,
    last: `/posts?per_page=${perPage}&page=${postsInDB / perPage}`,
  });
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
