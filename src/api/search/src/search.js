const { ELASTIC_MAX_RESULTS_PER_PAGE = 5, POSTS_URL } = process.env;
const { Elastic } = require('@senecacdot/satellite');

const client = Elastic();

const index = 'posts';

const calculateFrom = (page, perPage) => {
  const ES_MAX = 10000; // 10K is the upper limit of what ES will return without issue for searches
  const wanted = page * perPage;
  // Don't exceed 10K, and if we will, return an offset under it by one page size
  return wanted + perPage <= ES_MAX ? wanted : ES_MAX - perPage;
};

/**
 * Advanced search allows you to look up multiple or single fields based on the input provided
 * @param options.post    - text to search in post field
 * @param options.author  - text to search in author field
 * @param options.title   - text to search in title field
 * @param options.from    - published after this date
 * @param options.to      - published before this date
 * @return all the results matching the fields text
 * Range queries: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_ranges
 * Match field queries: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ppmatch-query.html#query-dsl-match-query-zero
 */
const search = async (options) => {
  const results = {
    query: {
      bool: {
        must: [],
      },
    },
    sort: [{ published: { order: 'desc' } }],
  };

  const { must } = results.query.bool;

  if (options.author) {
    must.push({
      match: {
        author: {
          query: options.author,
          zero_terms_query: 'all',
          operator: 'and',
        },
      },
    });
  }

  if (options.post) {
    must.push({
      match: {
        text: {
          query: options.post,
          zero_terms_query: 'all',
        },
      },
    });
  }

  if (options.title) {
    must.push({
      match: {
        title: {
          query: options.title,
          zero_terms_query: 'all',
        },
      },
    });
  }

  if (options.from || options.to) {
    must.push({
      range: {
        published: {
          gte: options.from || '2000-01-01',
          lte: options.to || new Date().toISOString().split('T')[0],
        },
      },
    });
  }

  if (!options.perPage) {
    options.perPage = ELASTIC_MAX_RESULTS_PER_PAGE;
  }

  if (!options.page) {
    options.page = 0;
  }

  const {
    body: { hits },
  } = await client.search(
    {
      from: calculateFrom(options.page, options.perPage),
      size: options.perPage,
      _source: ['id'],
      index,
      body: results,
    },
    {
      meta: true,
    }
  );

  return {
    results: hits.total.value,
    values: hits.hits.map(({ _id }) => ({ id: _id, url: `${POSTS_URL}/${_id}` })),
  };
};

/**
 * authorAutocomplete allows for querying author autocomplete fields
 * @param { author } - text to search in author field
 * @return all the results matching the fields text
 */
const authorAutocomplete = async ({ author }) => {
  const results = {
    query: {
      match: {
        'author.autocomplete': {
          query: author,
          operator: 'and',
        },
      },
    },
    highlight: {
      fields: {
        'author.autocomplete': {},
      },
    },
  };

  const {
    body: { hits },
  } = await client.search(
    {
      size: 10000,
      _source: ['author'],
      index,
      body: results,
    },
    {
      meta: true,
    }
  );

  // Filter through all authors and remove duplicates then return up to 10 results
  const authors = hits.hits
    .reduce(
      (acc, { _source }, i) =>
        acc.find((item) => item.author === _source.author)
          ? acc
          : acc.concat({
              author: _source.author,
              highlight: hits.hits[i].highlight['author.autocomplete'][0],
            }),
      []
    )
    .slice(0, 10);

  return {
    results: authors.length,
    authors,
  };
};
module.exports = { search, authorAutocomplete };
