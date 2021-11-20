const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/**
 * Parse and return the String `html` into a JSDOM instance, or return `null`.
 */
module.exports = function toDOM(html) {
  if (typeof html !== 'string') {
    return null;
  }

  try {
    return new JSDOM(html);
  } catch (err) {
    return null;
  }
};
