const sanitize = require('./sanitize');
const lazyLoad = require('./lazy-load');
const syntaxHighlight = require('./syntax-highlight');
const toDOM = require('./dom');

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

  // Create a document we can process
  const dom = toDOM(clean);
  // Look for and syntax highlight <pre><code>...</code></pre> blocks
  syntaxHighlight(dom);
  // Update <img> and <iframe> elements to use native lazy loading.
  lazyLoad(dom);

  // Return the resulting HTML
  return dom.window.document.body.innerHTML;
};
