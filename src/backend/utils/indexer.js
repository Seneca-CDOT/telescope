require('../lib/config');

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const { ELASTIC_MAX_RESULTS } = process.env;
const { client } = require('../lib/elastic');
const { logger } = require('./logger');

const index = 'posts';
const type = 'post';

/**
 * Indexes the text and id from a post
 * @param text from a post
 * @param postId same id used to store on redis the post object where the text is from
 * @param title from a post
 * @param updated from a post
 * @param author from a post
 */
const indexPost = async (text, postId, title, updated, author) => {
  try {
    await client.index({
      index,
      type,
      id: postId,
      body: {
        text,
        title,
        updated,
        author,
      },
    });
  } catch (error) {
    logger.error({ error }, `There was an error indexing a post for id ${postId}`);
  }
};

/**
 * Deletes a previously indexed post by its id
 * @param postId same id used to store on redis the post object where the text is from
 */
const deletePost = async (postId) => {
  try {
    await client.delete({
      index,
      type,
      id: postId,
    });
  } catch (error) {
    logger.error({ error }, `There was an error deleting the post with id ${postId}`);
  }
};

/**
 * Searches text in elasticsearch
 * @param textToSearch
 * @return all the results matching the passed text
 */
const search = async (textToSearch) => {
  const query = {
    query: {
      simple_query_string: {
        query: textToSearch,
        default_operator: 'and',
        fields: ['text', 'title', 'author'],
      },
    },
  };

  const {
    body: { hits },
  } = await client.search({
    from: 0,
    _source: ['id'],
    size: ELASTIC_MAX_RESULTS || 100,
    index,
    type,
    body: query,
  });

  return {
    results: hits.total.value,
    values: hits.hits.map(({ _id }) => ({ id: _id })),
  };
};

/**
 * Checks elasticsearch's connectivity
 */
const checkConnection = () => client.cluster.health();

const waitOnReady = async () => {
  /**
   * Elasticsearch needs time after deployment for setting up all its components.
   * Here we set a timer using 'setTimeout' and check for connectivity during the countdown so elasticsearch
   * has time to be fully prepared to start indexing posts.
   */
  const DELAY = process.env.ELASTIC_DELAY_MS || 10000;
  let intervalId;
  let timerId;

  const timer = new Promise((resolve, reject) => {
    timerId = setTimeout(() => {
      reject(
        new Error(
          'Unable to connect to Elasticsearch. Use `MOCK_ELASTIC=1` in your `.env` to mock Elasticsearch, or install (see https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md)'
        )
      );
    }, DELAY);
  });

  const connectivity = new Promise((resolve) => {
    intervalId = setIntervalAsync(async () => {
      try {
        await checkConnection();
        resolve();
      } catch (error) {
        logger.info('Attempting to connect to elasticsearch...');
      }
    }, 500);
  });

  await Promise.race([timer, connectivity]);

  await clearIntervalAsync(intervalId);
  clearTimeout(timerId);
};

module.exports = {
  indexPost,
  deletePost,
  checkConnection,
  search,
  waitOnReady,
};
