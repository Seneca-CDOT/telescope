const fetch = require('node-fetch');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const FEED_URL = 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List';

const getWikiText = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.text();

    const dom = new JSDOM(data);
    return dom.window.document.querySelector('pre').textContent;
  } catch {
    throw new Error(`Unable to download wiki feed data from url ${url}`);
  }
};

/**
 * @typedef {{firstName:string,lastName:string,feed: string }} PlanetUser
 */

/**
 * Parse all users from the planet feed list hosted at https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List
 * @return {PromiseLike<PlanetUser[]>} - A list valid parsed users
 */
const parsePlanetFeedList = async () => {
  let wikiText;

  // Try to fetch the feed list from 'FEED_URL'
  try {
    wikiText = await getWikiText(FEED_URL);
    console.info(`Extracting users from ${FEED_URL}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // store every line in an array
  const lines = wikiText.split(/\r\n|\r|\n/);
  const commentRegex = /^\s*#/;

  let firstName;
  let lastName;
  let feed;
  const users = [];
  const uniqueUrls = new Set();

  // Iterate through all lines and find url/name pairs, then parse them.
  lines.forEach((line, index) => {
    if (!commentRegex.test(line) && line.startsWith('[')) {
      feed = line.replace(/[[\]']/g, '');

      try {
        // eslint-disable-next-line no-new
        new URL(feed); // If the URL is valid, continue
        [firstName, lastName] = lines[index + 1].replace(/^\s*name\s*=\s*/, '').split(' ');

        if (!uniqueUrls.has(feed)) {
          users.push({ firstName, lastName, feed });
          uniqueUrls.add(feed);
        }
      } catch {
        // If the URL is invalid, display error message
        console.error(`Skipping invalid wiki feed url ${feed} for author ${firstName} ${lastName}`);
      }
    }
  });

  return users;
};

module.exports = { getWikiText, parsePlanetFeedList };
