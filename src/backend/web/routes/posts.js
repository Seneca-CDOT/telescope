const express = require('express');
const { getPost, getPosts } = require('../../utils/storage');

const posts = express.Router();

posts.get('/', async (req, res) => {
  const arrayOfPosts = [];

  const redisGuids = await getPosts();

  redisGuids.forEach(guid => arrayOfPosts.push(getPost(guid)));
  const processedPosts = await Promise.all(arrayOfPosts);

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
