const apiHost = new URL(location).origin;

async function getFeedCount() {
  try {
    const data = await fetch(`${apiHost}/v1/posts/feeds`, {
      method: 'HEAD',
    });
    const feedCount = data.headers.get('x-total-count');
    const feedCountElement = document.getElementById('feeds-count');
    feedCountElement.innerText = feedCount ?? 'N/A';
  } catch (err) {
    console.error(err);
  }
}

window.onload = () => {
  getFeedCount();
};
