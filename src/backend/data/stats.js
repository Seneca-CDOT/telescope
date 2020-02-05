const { count } = require('@wordpress/wordcount');
const startOfWeek = require('date-fns/startOfWeek');
const startOfMonth = require('date-fns/startOfMonth');
const startOfYear = require('date-fns/startOfYear');

const { getPostsByDate } = require('../utils/storage');
const Post = require('./post');

/**
 * Get the total number of words in the text of all posts in the array
 * @param {Array<Post>} posts the array of post objects
 */
const countWords = posts => posts.reduce((total, post) => total + count(post.text, 'words', {}), 0);

/**
 * Get the total number of unique authors in the posts in the array
 * @param {Array<Post>} posts the array of post objects
 */
const countAuthors = posts => new Set(posts.map(post => post.author)).size;

class Stats {
  constructor(startDate, endDate) {
    if (!(startDate instanceof Date && endDate instanceof Date)) {
      throw new TypeError('startDate and endDate must be Dates');
    }
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * Returns a Promise<Array> of post ids
   */
  async calculate() {
    const ids = await getPostsByDate(this.startDate, this.endDate);
    const posts = await Promise.all(ids.map(Post.byId));

    return {
      posts: posts.length,
      authors: countAuthors(posts),
      words: countWords(posts),
    };
  }

  /**
   * Creates a new Stats object for today
   */
  static today() {
    const today = new Date();
    return new Stats(today, today);
  }

  /**
   * Creates a new Stats object for the first day of this week until today
   */
  static thisWeek() {
    const today = new Date();
    return new Stats(startOfWeek(today), today);
  }

  /**
   * Creates a new Stats object for the first day of this month until today
   */
  static thisMonth() {
    const today = new Date();
    return new Stats(startOfMonth(today), today);
  }

  /**
   * Creates a new Stats object for Jan 1 of this year until today
   */
  static thisYear() {
    const today = new Date();
    return new Stats(startOfYear(today), today);
  }
}

module.exports = Stats;
