const { fetch } = require('@senecacdot/satellite');

module.exports = async function getPostsCount() {
  let postsCount = 0;
  try {
    const data = await fetch(`${process.env.API_URL}/v1/posts`, { method: 'HEAD' });
    postsCount = data.headers.get('x-total-count');
  } catch (error) {
    console.error(error);
  }
  return postsCount;
};
