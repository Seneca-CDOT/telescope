#!/usr/bin/env node

/**
 * Once the Redis database is full of posts, this utility can be run
 * to get info about all the posts, and the HTML elements they contain.
 */

const jsdom = require('jsdom');

const Post = require('../src/backend/data/post');
const processPosts = require('./lib/process-posts');

const { JSDOM } = jsdom;

/**
 * Return a unique list of elements for the given list (no duplicates)
 * @param {Array} list - list of items with duplicates
 */
function uniq(list) {
  return [...new Set(list)];
}

/**
 * Return an array of all element names used for the HTML in a post
 * @param {String} guid - Redis key for this post
 */
async function processPost(id) {
  const post = await Post.byId(id);
  if (!post) {
    console.error(`No post found in database for id=${id}, skipping`);
    return [];
  }
  const frag = JSDOM.fragment(post.html);
  return Array.from(frag.querySelectorAll('*')).map((elem) => elem.tagName.toLowerCase());
}

/**
 * Return an Object with tag names as keys, counts as values
 * @param {Array[String]} elements - list of element (i.e., tag names)
 */
function countTags(elements) {
  const tagCounts = {};
  elements.forEach((elem) => {
    const count = tagCounts[elem] || 0;
    tagCounts[elem] = count + 1;
  });
  return tagCounts;
}

/**
 * Process all posts in the database, and print the list of HTML elements used.
 */
async function run() {
  try {
    const elements = (await processPosts(processPost)).flat();
    console.error(`Processing ${elements.length.toLocaleString()} elements...`);

    // Get counts for every tag we've seen
    const tagCounts = countTags(elements);
    // Get a sorted list of tags by count
    const uniqTags = uniq(elements).sort((a, b) => tagCounts[b] - tagCounts[a]);
    // Print our list of tags and counts/percentage in descending order
    uniqTags.forEach((tag, idx) => {
      const count = tagCounts[tag];
      const percent = (count / elements.length) * 100;
      console.log(`${idx + 1}. <${tag}> (${count.toLocaleString()}, ${percent.toFixed(3)}%)`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Unable to process posts', err);
    process.exit(1);
  }
}

run();
