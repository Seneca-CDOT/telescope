#!/usr/bin/env node

/**
 * Once the Redis database is full of posts, this utility can be run
 * to get info about all the posts, and the HTML elements they contain.
 */

const jsdom = require('jsdom');

const { getPost } = require('../src/backend/utils/storage');
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
async function processPost(guid) {
  const { content } = await getPost(guid);
  const frag = JSDOM.fragment(content);
  return Array.from(frag.querySelectorAll('*')).map(elem => elem.tagName.toLowerCase());
}

/**
 * Return an Object with tag names as keys, counts as values
 * @param {Array[String]} elements - list of element (i.e., tag names)
 */
function countTags(elements) {
  const tagCounts = {};
  elements.forEach(elem => {
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
    // Print our list of tags and counts in descending order
    uniqTags.forEach((tag, idx) =>
      console.log(`${idx + 1}. <${tag}> (${tagCounts[tag].toLocaleString()})`)
    );

    process.exit(0);
  } catch (err) {
    console.error('Unable to process posts', err);
    process.exit(1);
  }
}

run();
