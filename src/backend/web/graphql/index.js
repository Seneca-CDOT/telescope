const { gql: graphql } = require('apollo-server-express');

const { getFeedsCount, getFeeds, getPostsCount, getPosts } = require('../../utils/storage');

const Post = require('../../data/post');
const Feed = require('../../data/feed');

const maxPostsPerPage = process.env.MAX_POSTS_PER_PAGE || 30;

module.exports.typeDefs = graphql`
  # 'Feed' matches our Feed type used with redis
  type Feed {
    id: String
    name: String
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
    getPosts(page: Int, perPage: Int): [Post]
    getPostsCount: Int
  }
`;

module.exports.resolvers = {
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
    getPosts: async (parent, { page, perPage }) => {
      const prPage = perPage > maxPostsPerPage ? maxPostsPerPage : perPage;

      const numOFPosts = await getPostsCount();
      const first = page * prPage;

      if (first < numOFPosts) {
        const last = first + prPage < numOFPosts ? first + prPage : numOFPosts;
        const postIds = await getPosts(first, last);

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
