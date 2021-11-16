const { fetchFeeds } = require('../api');

export async function getFeedCount() {
  try {
    const data = await fetchFeeds();
    const feedCount = data.headers.get('X-Total-Count');
    const feedCountElement = document.getElementById('feeds-count');
    feedCountElement.innerText = feedCount;
  } catch (err) {
    console.error(err);
  }
}
