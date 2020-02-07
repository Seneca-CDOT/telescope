const { GraphQLDate } = require('graphql-iso-date');

const { gql: graphql } = require('apollo-server-express');

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
      const prPage = perPage > maxPostsPerPage ? maxPostsPerPage : perPage;

      const numOFPosts = await getPostsCount();
      const first = page * prPage;

      if (first < numOFPosts) {
        const last = first + prPage < numOFPosts ? first + prPage : numOFPosts;
        const postIds = await getPosts(first, last);

        const result = await Promise.all(postIds.map(id => Post.byId(id)));

        if (filter) {
          // check if author name is equal to what we're searching for
          if (filter.author) {
            return result.filter(post => post.author === filter.author);
          }
          // check if post's date is between two provided dates
          if (filter.fromDate || filter.toDate) {
            const fromDate = filter.fromDate ? filter.fromDate : new Date();
            const toDate = filter.toDate ? filter.toDate : new Date();
            const datePostIds = await getPostsByDate(fromDate, toDate);
            return result.filter(post => datePostIds.includes(post.id));
          }
          // check if url is equal to what we're searching for
          if (filter.url) {
            return result.filter(post => post.url === filter.url);
          }
        }

        return result;
      }
      return [];
    },

    /**
     * @return Number of Post objects in our database
     */
    getPostsCount: () => getPostsCount(),
  },
};
