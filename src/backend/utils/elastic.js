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
    logger.error(`There was an error indexing a post for id ${postId}: ${error}`);
  }
};

/**
 * Searches text in elasticsearch
 * @param textToSearch
 * @return all the results matching the passed text
 */
const getIndexResults = async textToSearch => {
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

module.exports = {
  indexPost,
  checkConnection,
  getIndexResults,
};
