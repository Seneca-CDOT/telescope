// Sanitize HTML and prevent XSS attacks
// <img src=x onerror=alert(1)> becomes <img src="x">

const sanitizeHtml = require('sanitize-html');

module.exports = function(dirty) {
  return sanitizeHtml(dirty, {
    // Add <img> to the list of allowed tags, see:
    // https://github.com/apostrophecms/sanitize-html#what-are-the-default-options
    allowedTags: [
      'img',
      'figure',
      'br',
      'p',
      'a',
      'ol',
      'nl',
      'div',
      'li',
      'td',
      'strong',
      'pre',
      'code',
      'b',
      'em',
      'ul',
      'tr',
      'h3',
      'td',
      'i',
      'h4',
      'pre',
      'blockquote',
      'hr',
      'table',
      'tbody',
      'th',
      'h5',
      'strike',
      'h6',
      'thread',
      'caption',
    ],
  });
};
