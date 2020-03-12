// Sanitize HTML and prevent XSS attacks
// <img src=x onerror=alert(1)> becomes <img src="x">

const sanitizeHtml = require('sanitize-html');

module.exports = function(dirty) {
  return sanitizeHtml(dirty, {
    // Add <img> to the list of allowed tags, see:
    // https://github.com/apostrophecms/sanitize-html#what-are-the-default-options
    allowedTags: [
      'a',
      'b',
      'blockquote',
      'br',
      'caption',
      'code',
      'div',
      'em',
      'figure',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'img',
      'li',
      'nl',
      'ol',
      'p',
      'pre',
      'pre',
      'strike',
      'strong',
      'table',
      'tbody',
      'td',
      'td',
      'th',
      'thread',
      'tr',
      'ul',
    ],
  });
};
