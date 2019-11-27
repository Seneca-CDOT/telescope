const express = require('express');
const { getPost } = require('../../utils/storage');

const post = express.Router();

post.get('/:id', async (req, res) => {
  const redisPost = await getPost(req.params.id);

  res.json(redisPost);
});

module.exports = post;
