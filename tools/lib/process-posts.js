/**
 * Helper for iterating over posts in Redis.
 */

const { getPosts } = require('../../src/backend/utils/storage');

/**
 * Process all posts in the database, calling the processPosts function on each.
 * The processPost function is expected to return a Promise.
 */
async function processPosts(processPost) {
  const posts = await getPosts(0, 0);
  console.error(`Processing ${posts.length} posts...`);

  return Promise.all(posts.map(processPost));
}

module.exports = processPosts;
