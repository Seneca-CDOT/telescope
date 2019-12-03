const express = require('express');
const { getPost, getPosts } = require('../../utils/storage');

const posts = express.Router();

posts.get('/', async (req, res) => {
  const redisGuids = await getPosts();

  const processedPosts = await Promise.all(redisGuids.map(guid => getPost(guid)));

  const listOfPosts = processedPosts
    // Return id and url for a specific post
    .map(processed => {
      return {
        id: processed.guid,
        url: `/post/:${processed.guid}`,
      };
    });

  res.json(listOfPosts);
});

module.exports = posts;
