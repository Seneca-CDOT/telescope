const jsdom = require('jsdom');
const sanitize = require('./sanitize');
const fixIFrameWidth = require('./fix-iframe-width');
const lazyLoad = require('./lazy-load');
const syntaxHighlight = require('./syntax-highlight');
const fixEmptyPre = require('./modify-pre');
const removeEmpty = require('./remove-empty-paragraphs');
const toDOM = require('./dom');
const removeEmptyAnchor = require('./remove-empty-anchor');

const { JSDOM } = jsdom;

/**
 * Takes a String of HTML and sanitizes, syntax highlights, and
 * modifies <img> and <iframe> elements to be lazy loaded. Returns
 * the updated HTML.
 */
module.exports = (html) => {
  // Expect a String, return anything else untouched.
  if (typeof html !== 'string') {
    return html;
  }

  // Sanitize the HTML to remove unwanted elements and attributes
  const clean = sanitize(html);

  // Checks if the context of the sanitized html contains whitespace only.
  const fragment = JSDOM.fragment(clean);
  if (fragment.textContent.replace(/\s/gim, '').length <= 0) {
    throw new Error('post is empty');
  }

  // Create a document we can process
  const dom = toDOM(clean);

  // Insert <code> elements into empty <pre>
  fixEmptyPre(dom);
  // Look for and syntax highlight <pre><code>...</code></pre> blocks
  syntaxHighlight(dom);
  // Wrap <iframe> elements in a <div> so we can style their width
  fixIFrameWidth(dom);
  // Update <img> and <iframe> elements to use native lazy loading.
  lazyLoad(dom);
  // Remove <p> elements that contain whitespace, and <br>
  removeEmpty(dom);
  // Remove empty <a> elements
  removeEmptyAnchor(dom);

  // Return the resulting HTML
  return dom.window.document.body.innerHTML;
};
