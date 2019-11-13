require('dotenv').config();
const bent = require('bent');
const jsdom = require('jsdom');

const request = bent('string');
const { JSDOM } = jsdom;

/*
* getData() returns Promise { <pending> }
* It gets the data from 'pre' tag in a provided url
* Splits the data into lines so its easier to process as a string array
* That data is then returned as a Promise
*/
function getData() {
  const list = request(process.env.FEED_URL)
    .then((data) => {
      const dom = new JSDOM(data);
      let feedList = '';
      feedList = dom.window.document.querySelector('pre').textContent;
      return feedList.split(/\r\n|\r|\n/);
    }).catch((err) => { throw err; });

  return list;
}

/*
* parseData() returns Promise { <pending> }
* It gets the data from getData function
* Then processes it to remove square brackets from links and 'name=' in front of a name
* That data is then returned as a Promise
*/
function parseData() {
  const nameCheck = /^name/i;
  const commentCheck = /^#/;

  let feed = '';
  let line = '';

  const parsedData = getData().then((data) => {
    data.forEach((element) => {
      if (!commentCheck.test(element)) {
        if (element.startsWith('[')) {
          line = element.replace(/([\[\]']+)/g, '');
          feed += `${line}\n`;
        }
        if (nameCheck.test(element)) {
          line = element.replace(/^\s*name\s*=\s*/, '');
          feed += `${line}\n`;
        }
      }
      console.log(feed);
      return feed;
    });
  }).catch((err) => { throw err; });

  return parsedData;
}

parseData();
