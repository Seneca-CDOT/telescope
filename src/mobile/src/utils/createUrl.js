import Constants from 'expo-constants';

const POST_URL = Constants.manifest.extra.postsUrl;

const createPostUrl = (perPage, page) => {
  return `${POST_URL}?per_page=${perPage}&page=${page}`;
};

export default createPostUrl;
