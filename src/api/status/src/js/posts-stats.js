const { fetch } = require('@senecacdot/satellite');

module.exports = async function getPostsCount() {
  try {
    const data = await fetch(process.env.POSTS_URL, { method: 'HEAD' });
    return data.headers.get('x-total-count');
  } catch (error) {
    console.error(error);
  }
  return 0;
};
