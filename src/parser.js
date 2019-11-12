const bent = require('bent');
const jsdom = require('jsdom');

const request = bent('string');
const url = 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List';
const { JSDOM } = jsdom;
const nameTest = /^name/i;
const linkTest = /^#/;
let lines = '';
let feed = '';
let feedList = '';
let tempLine = '';

/**
* Get feed data from url
* process it to remove unnecessary information like "name" and square brackets
*/
request(url)
  .then((data) => {
    const dom = new JSDOM(data);
    feedList = dom.window.document.querySelector('pre').textContent;
    lines = feedList.split(/\r\n|\r|\n/);

    lines.forEach((element) => {
      if (!linkTest.test(element)) {
        if (element.startsWith('[')) {
          tempLine = element.replace(/\[href="|\[/, '');
          tempLine = tempLine.replace(']', '');
          feed += `${tempLine}\n`;
        }
        if (nameTest.test(element)) {
          tempLine = element.replace(/^name = |^name= |^name=/i, '');
          feed += `${tempLine}\n`;
        }
      }
    });
    console.log(feed);
  })
  .catch((err) => { throw err; });
