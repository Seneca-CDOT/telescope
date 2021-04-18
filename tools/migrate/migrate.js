const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { isWebUri } = require('valid-url');
const fs = require('fs');

const { JSDOM } = jsdom;
const URL = 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List';
const FILE = 'legacy_users.json';

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

(async () => {
  let wikiText;

  // Try to fetch the feed list from 'FEED_URL'
  try {
    wikiText = await getWikiText(URL);
    console.info(`Extracting users from ${URL}`);
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

  // Iterate through all lines and find url/name pairs, then parse them.
  lines.forEach((line, index) => {
    if (!commentRegex.test(line) && line.startsWith('[')) {
      feed = line.replace(/[[\]']/g, '');

      if (feed.length && isWebUri(feed)) {
        [firstName, lastName] = lines[index + 1].replace(/^\s*name\s*=\s*/, '').split(' ');
        users.push({ firstName, lastName, feed });
      } else {
        console.error(`Skipping invalid wiki feed url ${feed} for author ${firstName} ${lastName}`);
      }
    }
  });

  try {
    fs.writeFileSync(`${FILE}`, JSON.stringify(users));
    console.log(
      `Processed ${users.length} records. Legacy users were successfully written to file: ${FILE}.`
    );
  } catch (err) {
    console.error(err);
  }
})();
