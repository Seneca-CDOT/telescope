const { gql } = require('apollo-server-express');

const maxPostsPerPage = 30;

module.exports.typeDefs = gql`
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
    getFeed: (parent, { guid }, { storage }) => {
      return storage.getFeed(guid);
    },

    /**
     * @description Fetches all the Feed objects in our database
     * @return Array Feed objects
     */
    getFeeds: (parent, arg, { storage }) => {
      return storage.getFeeds('feeds');
    },

    /**
     * @return Number of Feed objects in our database
     */
    getFeedsCount: (parent, arg, { storage }) => {
      return storage.getFeedsCount();
    },

    /**
     * @description Takes a guid and returns a Post object
     * @param guid
     * @return Post object for the passed guid
     */
    getPost: (parent, { guid }, { storage }) => {
      return storage.getPost(guid);
    },

    /**
     * @description Fetches 'perPage' number of Post objects from page number 'page'.
     * @param page Number of page from which Posts objects are fetched
     * @param perPage Number of Post objects in every page
     * @return Array of 'perPage' number of Post objects
     */
    getPosts: async (parent, { page, perPage }, { storage }) => {
      const prPage = perPage > maxPostsPerPage ? maxPostsPerPage : perPage;

      const numOFPosts = await storage.getPostsCount();
      const first = page * prPage;

      if (first < numOFPosts) {
        const last = first + prPage < numOFPosts ? first + prPage : numOFPosts;
        const posts = await storage.getPosts(first, last);

        return Promise.all(posts.map(post => storage.getPost(post)));
      }
      return [];
    },

    /**
     * @return Number of Post objects in our database
     */
    getPostsCount: (parent, arg, { storage }) => {
      return storage.getPostsCount();
    },
  },
};
