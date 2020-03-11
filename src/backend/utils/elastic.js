require('../lib/config');

const { ELASTIC_URL, ELASTIC_PORT, ELASTIC_MAX_RESULTS } = process.env;
const { Client } = require('@elastic/elasticsearch');

const elasticUrl = `${ELASTIC_URL}:${ELASTIC_PORT}` || 'http://localhost:9200';
const esClient = new Client({ node: elasticUrl });

const { logger } = require('../utils/logger');

const index = 'posts';
const type = 'post';

/**
 * Indexes the text and id from a post
 * @param text from a post
 * @param postId same id used to store on redis the post object where the text is from
 */
const indexPost = async (text, postId) => {
  try {
    await esClient.index({
      index,
      type,
      id: postId,
      body: {
        text,
      },
    });
  } catch (error) {
    logger.error({ error }, `There was an error indexing a post for id ${postId}`);
  }
};

/**
 * Searches text in elasticsearch
 * @param textToSearch
 * @return all the results matching the passed text
 */
const search = async textToSearch => {
  const query = {
    query: {
      match: {
        text: {
          query: textToSearch,
          operator: 'AND',
          fuzziness: 'auto',
        },
      },
    },
  };

  const {
    body: { hits },
  } = await esClient.search({
    from: 0,
    size: ELASTIC_MAX_RESULTS || 100,
    index,
    type,
    body: query,
  });
  const results = hits.total.value;
  const values = hits.hits.map(({ _id, _source, _score }) => {
    return {
      id: _id,
      text: _source.text,
      score: _score,
    };
  });

  return {
    results,
    values,
  };
};

/**
 * Checks elasticsearch's connectivity
 */
const checkConnection = () => esClient.cluster.health();

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
      reject(new Error('Unable to connect to Elasticsearch'));
    }, DELAY);
  });

  const connectivity = new Promise(resolve => {
    intervalId = setInterval(() => {
      checkConnection()
        .then(resolve)
        .catch(() => logger.info('Attempting to connect to elasticsearch...'));
    }, 500);
  });

  await Promise.race([timer, connectivity]);

  clearInterval(intervalId);
  clearTimeout(timerId);
};

module.exports = {
  indexPost,
  checkConnection,
  search,
  waitOnReady,
};
