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
      'del',
      'div',
      'em',
      'figure',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'iframe',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      'strike',
      'strong',
      'table',
      'tbody',
      'td',
      'th',
      'thread',
      'tr',
      'ul',
    ],
    allowedAttributes: {
      iframe: ['src'],
      img: ['src'],
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  });
};
