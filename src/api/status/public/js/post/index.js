const apiUrl = new URL(window.location).origin;

const fetchPostsCount = () =>
  fetch(`${apiUrl}/v1/posts`, { method: 'HEAD' }).then((res) => res.headers.get('x-total-count'));

export default async () => {
  try {
    const numberOfPosts = await fetchPostsCount();
    const totalPostsEl = document.getElementById('totalPosts');
    totalPostsEl.innerText = numberOfPosts ?? 'N/A';
  } catch (error) {
    console.log(error);
  }
};
