// Mock storage for our es data
const db = {};

const indexPost = (text, postId) => {
  db[postId] = text;
  return Promise.resolve();
};

const deletePost = (postId) => {
  delete db[postId];
  return Promise.resolve();
};

// TODO
const search = () =>
  Promise.resolve({
    results: 0,
    values: [],
  });

const checkConnection = () => Promise.resolve();

const waitOnReady = () => Promise.resolve();

module.exports = {
  // Expose the internal db for testing
  db,
  indexPost,
  deletePost,
  checkConnection,
  search,
  waitOnReady,
};
