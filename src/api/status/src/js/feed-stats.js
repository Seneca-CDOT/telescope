const { fetch } = require('@senecacdot/satellite');

module.exports = async function getFeedCount() {
  try {
    const data = await fetch(`${process.env.POSTS_URL}/feeds`, { method: 'HEAD' });
    return data.headers.get('x-total-count');
  } catch (err) {
    console.error(err);
  }
  return 0;
};
