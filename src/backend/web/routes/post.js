const express = require('express');
const { getPost } = require('../../utils/storage');
const { logger } = require('../../utils/logger');

const post = express.Router();

// Allow for the id to be a URI, possibly containing path separators
post.get('/*', async (req, res) => {
  const guid = req.params[0];

  let redisPost;
  try {
    redisPost = await getPost(guid);
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
    return;
  }

  // If the object we get back is empty, use 404
  if (redisPost && !redisPost.guid) {
    res.status(404).json({
      message: `Post not found for id ${guid}`,
    });
    return;
  }

  res.json(redisPost);
});

module.exports = post;
