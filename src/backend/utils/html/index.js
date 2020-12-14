const jsdom = require('jsdom');
const sanitize = require('./sanitize');
const fixIFrameWidth = require('./fix-iframe-width');
const lazyLoad = require('./lazy-load');
const syntaxHighlight = require('./syntax-highlight');
const replaceCodeEntities = require('./replace-entities');
const fixEmptyPre = require('./modify-pre');
const toDOM = require('./dom');
const removeEmptyParagraphs = require('./remove-empty-paragraphs');
const replaceBreaklines = require('./replace-redundant-breaklines');

const { JSDOM } = jsdom;

/**
 * Takes a String of HTML and sanitizes, syntax highlights, and
 * modifies <img> and <iframe> elements to be lazy loaded. Returns
 * the updated HTML.
 */
module.exports = function process(html) {
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
  // Replace <code> elements with encoded entities to use characters
  replaceCodeEntities(dom);
  // Clean repeated and nested <br> elements
  replaceBreaklines(dom);
  // Remove empty <p> elements
  removeEmptyParagraphs(dom);

  // Return the resulting HTML
  return dom.window.document.body.innerHTML;
};
