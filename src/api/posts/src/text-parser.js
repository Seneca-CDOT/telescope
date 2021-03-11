const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/**
 * Given a fragment of HTML, build a DOM element and get its text content.
 * If we get back nothing, return the empty string.
 */
module.exports = (htmlFragment) => JSDOM.fragment(htmlFragment).textContent || '';
