const express = require('express');
const Post = require('../../post');
const { logger } = require('../../utils/logger');

const postRoute = express.Router();

// Allow for the id to be a URI, possibly containing path separators
postRoute.get('/*', async (req, res) => {
  const guid = decodeURIComponent(req.params[0]);

  try {
    const post = await Post.byGuid(guid);

    // If the object we get back is empty, use 404
    if (!post) {
      res.status(404).json({
        message: `Post not found for id ${guid}`,
      });
    } else {
      res.json(post);
    }
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    res.status(503).json({
      message: 'Unable to connect to database',
    });
  }
});

module.exports = postRoute;
