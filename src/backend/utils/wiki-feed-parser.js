const fetch = require('node-fetch');
const jsdom = require('jsdom');
require('../lib/config');

const { JSDOM } = jsdom;

/*
 * getData() returns Promise { <pending> }
 * It gets the data from 'pre' tag in a provided url
 * Splits the data into lines so its easier to process as a string array
 * That data is then returned as a Promise
 */
module.exports.getData = function() {
  return fetch(process.env.FEED_URL)
    .then(res => res.text())
    .then(data => {
      const dom = new JSDOM(data);
      return dom.window.document.querySelector('pre').textContent.split(/\r\n|\r|\n/);
    })
    .catch(err => {
      throw err;
    });
};

/*
 * parseData() returns Promise { <pending> }
 * It gets the data from getData function
 * Then processes it to remove square brackets from links and 'name=' in front of a name
 * That data is then returned as a Promise
 */
module.exports.parseData = function() {
  const nameCheck = /^name/i;
  const commentCheck = /^#/;

  let line = '';

  return this.getData()
    .then(data => {
      const objArray = [];
      let feed = [];
      data.forEach(element => {
        if (!commentCheck.test(element)) {
          if (element.startsWith('[')) {
            // eslint-disable-next-line no-useless-escape
            line = element.replace(/[\[\]']/g, '');
            feed.push(`${line}`);
          }
          if (nameCheck.test(element)) {
            line = element.replace(/^\s*name\s*=\s*/, '');
            feed.push(`${line}`);
            let obj = {
              name: feed[feed.length - 1],
              link: feed[feed.length - 2],
            };
            objArray.push(obj);
            feed = [];
            obj = {};
          }
        }
      });
      return objArray;
    })
    .catch(err => {
      throw err;
    });
};
