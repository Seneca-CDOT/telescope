const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// Simple function to convert html to text
// Issue #75: https://github.com/Seneca-CDOT/telescope/issues/75
exports.run = async function (html) {
  const frag = JSDOM.fragment(html);
  const result = await frag.textContent;
  return result;
};
