const { fetch } = require('@senecacdot/satellite');

module.exports = async function getFeedCount() {
  let feedCount = 0;
  try {
    const data = await fetch(`${process.env.API_URL}/v1/posts/feeds`, {
      method: 'HEAD',
    });
    feedCount = data.headers.get('x-total-count');
  } catch (err) {
    console.error(err);
  }
  return feedCount;
};
