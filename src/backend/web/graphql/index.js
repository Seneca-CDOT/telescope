const { gql: graphql } = require('apollo-server-express');

const {
  getFeedsCount,
  getFeed,
  getFeeds,
  getPostsCount,
  getPosts,
} = require('../../utils/storage');

const Post = require('../../post');

const maxPostsPerPage = process.env.MAX_POSTS_PER_PAGE || 30;

module.exports.typeDefs = graphql`
  # 'Feed' matches our Feed type used with redis
  type Feed {
    name: String
    url: String
  }

  # 'Post' matches our Post type used with redis
  type Post {
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
    getFeed(guid: ID!): Feed
    getFeeds: [ID]
    getFeedsCount: Float
    getPost(guid: ID!): Post
    getPosts(page: Int, perPage: Int): [Post]
    getPostsCount: Float
  }
`;

module.exports.resolvers = {
  Query: {
    /**
     * @description Takes a guid and returns a Feed object
     * @param guid
     * @return Feed object for the passed guid
     */
    getFeed: (parent, { guid }) => {
      return getFeed(guid);
    },

    /**
     * @description Fetches all the Feed objects in our database
     * @return Array Feed objects
     */
    getFeeds: () => {
      return getFeeds('feeds');
    },

    /**
     * @return Number of Feed objects in our database
     */
    getFeedsCount: () => {
      return getFeedsCount();
    },

    /**
     * @description Takes a guid and returns a Post object
     * @param guid
     * @return Post object for the passed guid
     */
    getPost: (parent, { guid }) => {
      return Post.byGuid(guid);
    },

    /**
     * @description Fetches 'perPage' number of Post objects from page number 'page'.
     * @param page Number of page from which Posts objects are fetched
     * @param perPage Number of Post objects in every page
     * @return Array of 'perPage' number of Post objects
     */
    getPosts: async (parent, { page, perPage }) => {
      const prPage = perPage > maxPostsPerPage ? maxPostsPerPage : perPage;

      const numOFPosts = await getPostsCount();
      const first = page * prPage;

      if (first < numOFPosts) {
        const last = first + prPage < numOFPosts ? first + prPage : numOFPosts;
        const posts = await getPosts(first, last);

        return Promise.all(posts.map(post => Post.byGuid(post)));
      }
      return [];
    },

    /**
     * @return Number of Post objects in our database
     */
    getPostsCount: () => {
      return getPostsCount();
    },
  },
};
