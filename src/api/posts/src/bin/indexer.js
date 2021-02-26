const { ELASTIC_MAX_RESULTS_PER_PAGE = 5 } = process.env;
const { logger } = require('@senecacdot/satellite');
const { client } = require('../libs/elastic');

const index = 'posts';
const type = 'post';

/**
 * Indexes the text and id from a post
 * @param post
 * @param post.text from a post
 * @param post.id same id used to store on redis the post object where the text is from
 * @param post.title from a post
 * @param post.published from a post
 * @param post.author from a post
 */
const indexPost = async ({ text, id, title, published, author }) => {
  try {
    await client.index({
      index,
      type,
      id,
      body: {
        text,
        title,
        published,
        author,
      },
    });
  } catch (error) {
    logger.error({ error }, `There was an error indexing a post for id ${id}`);
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

module.exports = {
  indexPost,
  deletePost,
  search,
};
