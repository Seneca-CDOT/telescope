const { GraphQLDate } = require('graphql-iso-date');
const { gql: graphql } = require('apollo-server-express');
const normalize = require('normalize-url');

const {
  getFeedsCount,
  getFeeds,
  getPostsCount,
  getPosts,
  getPostsByDate,
} = require('../../utils/storage');

const Post = require('../../data/post');
const Feed = require('../../data/feed');

const maxPostsPerPage = process.env.MAX_POSTS_PER_PAGE || 30;

module.exports.typeDefs = graphql`
  # 'Feed' matches our Feed type used with redis
  type Feed {
    id: String
    author: String
    url: String
  }

  # 'Post' matches our Post type used with redis
  type Post {
    id: String
    author: String
    title: String
    html: String
    text: String
    published: String
    updated: String
    url: String
    site: String
    guid: String
  }

  # Queries to fetch data from redis
  type Query {
    getFeedById(id: ID!): Feed
    getFeedByUrl(url: String!): Feed
    getFeeds: [Feed]
    getFeedsCount: Int
    getPost(id: ID!): Post
    getPosts(filter: PostFilter, page: Int, perPage: Int): [Post]
    getPostsCount: Int
  }

  # Post filters
  input PostFilter {
    author: String
    fromDate: Date
    toDate: Date
    url: String
  }

  # Feed filters
  input FeedFilter {
    id: String
    author: String
    url: String
  }

  scalar Date
`;

module.exports.resolvers = {
  // Custom Date scalar from package
  Date: GraphQLDate,

  Query: {
    /**
     * @description Takes an id and returns a Feed object
     * @param id
     * @return Feed object for the passed id
     */
    getFeedById: (parent, { id }) => Feed.byId(id),

    /**
     * @description Takes a url and returns a Feed object
     * @param url
     * @return Feed object for the passed url
     */
    getFeedByUrl: (parent, { url }) => Feed.byUrl(url),

    /**
     * @description Fetches all the Feed objects in our database
     * @return Array Feed objects
     */
    getFeeds: async () => {
      const feedIds = await getFeeds();
      return Promise.all(feedIds.map(id => Feed.byId(id)));
    },

    /**
     * @return Number of Feed objects in our database
     */
    getFeedsCount: () => getFeedsCount(),

    /**
     * @description Takes an id and returns a Post object
     * @param guid
     * @return Post object for the passed id
     */
    getPost: (parent, { id }) => Post.byId(id),

    /**
     * @description Fetches 'perPage' number of Post objects from page number 'page'.
     * @param page Number of page from which Posts objects are fetched
     * @param perPage Number of Post objects in every page
     * @return Array of 'perPage' number of Post objects
     */
    getPosts: async (parent, { filter, page, perPage }) => {
      let postIds;
      const numOfPosts = await getPostsCount();
      const prPage = perPage > maxPostsPerPage ? maxPostsPerPage : perPage;

      // For Date Filter
      if (filter) {
        if (filter.fromDate || filter.toDate) {
          const fromDate = filter.fromDate ? filter.fromDate : new Date();
          const toDate = filter.toDate ? filter.toDate : new Date();
          postIds = await getPostsByDate(fromDate, toDate); // Get all results within the date
          // check if # of filtered results are less than max results allowed per page.
          if (postIds.length < prPage) {
            return Promise.all(postIds.map(id => Post.byId(id))); // return all the posts' info
          }
          // Otherwise do some pagination here
          const pageResult = postIds.slice(page - 1 * perPage, page * prPage);
          return Promise.all(pageResult.map(id => Post.byId(id)));
        }
        // Other filters use the getPosts() instead of getPostsByDate()
        postIds = await getPosts(0, numOfPosts);
        const result = await Promise.all(postIds.map(id => Post.byId(id)));

        if (filter.url) {
          const authorResults = result.filter(post => post.author === filter.author);
          // check if # of filtered results are less than max results allowed per page.
          if (authorResults.length < prPage) {
            return authorResults;
          }
          return authorResults.slice(page - 1 * perPage, page * prPage);
        }

        if (filter.author) {
          const urlResults = result.filter(post => post.url === normalize(filter.url));
          // check if # of filtered results are less than max results allowed per page.
          if (urlResults.length < prPage) {
            return urlResults;
          }
          return urlResults.slice(page - 1 * perPage, page * prPage);
        }
      }

      const first = page * prPage;

      if (first < numOfPosts) {
        const last = first + prPage < numOfPosts ? first + prPage : numOfPosts;
        postIds = await getPosts(first, last);

        return Promise.all(postIds.map(id => Post.byId(id)));
      }

      return [];
    },

    /**
     * @return Number of Post objects in our database
     */
    getPostsCount: () => getPostsCount(),
  },
};
