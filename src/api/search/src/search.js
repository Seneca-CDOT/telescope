const { ELASTIC_MAX_RESULTS_PER_PAGE = 5 } = process.env;
const { client } = require('./elastic');

const index = 'posts';
const type = 'post';

/**
 * Creates fields from filter, now the filter is used for author and post but it will be added more.
 * the fields will be used for ES
 * @param {string} filter
 */
const createFieldsFromFilter = (filter) => {
  switch (filter) {
    case 'author':
      return ['author'];
    case 'post':
    default:
      return ['text', 'title'];
  }
};

const sortFromFilter = (filter) => {
  switch (filter) {
    case 'author':
      return [{ published: { order: 'desc' } }];
    case 'post':
    default:
      return undefined;
  }
};

const calculateFrom = (page, perPage) => {
  const ES_MAX = 10000; // 10K is the upper limit of what ES will return without issue for searches
  const wanted = page * perPage;
  // Don't exceed 10K, and if we will, return an offset under it by one page size
  return wanted + perPage <= ES_MAX ? wanted : ES_MAX - perPage;
};

/**
 * Searches text in elasticsearch
 * @param textToSearch
 * @param filter
 * @return all the results matching the passed text
 */
const search = async (
  textToSearch,
  filter = 'post',
  page = 0,
  perPage = ELASTIC_MAX_RESULTS_PER_PAGE
) => {
  const query = {
    query: {
      simple_query_string: {
        query: textToSearch,
        default_operator: 'and',
        fields: createFieldsFromFilter(filter),
      },
    },
    sort: sortFromFilter(filter),
  };

  const {
    body: { hits },
  } = await client.search({
    from: calculateFrom(page, perPage),
    size: perPage,
    _source: ['id'],
    index,
    type,
    body: query,
  });

  return {
    results: hits.total.value,
    values: hits.hits.map(({ _id }) => ({ id: _id, url: `/posts/${_id}` })),
  };
};

module.exports = search;
