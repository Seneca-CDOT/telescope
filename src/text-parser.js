const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// Simple function to convert html to text
// Issue #75: https://github.com/Seneca-CDOT/telescope/issues/75
exports.run = async function (html) {
  const dom = new JSDOM(html);
  const result = dom.window.document.querySelector('body').textContent;

  return Promise.resolve(result);
};
