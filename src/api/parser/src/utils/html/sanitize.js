// Sanitize HTML and prevent XSS attacks
// <img src=x onerror=alert(1)> becomes <img src="x">

const sanitizeHtml = require('sanitize-html');

const { WEB_URL } = process.env;

module.exports = (dirty) => {
  return sanitizeHtml(dirty, {
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
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedAttributes: {
      iframe: ['src'],
      img: ['src'],
      a: ['href'],
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'player.vimeo.com',
      'player.twitch.tv',
      'giphy.com',
      'cdn.embedly.com',
      'open.spotify.com',
      'medium.com',
    ],
    transformTags: {
      iframe: (tagName, attribs) => {
        const swapParent = (url, host) => {
          try {
            const urlObj = new URL(url);
            let updatedUrl;
            // We only want to modify twitch iframe content, and nothing else
            if (urlObj.host === 'player.twitch.tv' && urlObj.searchParams.get('parent')) {
              // Set the parent to localhost in development only
              if (process.env.NODE_ENV === 'development') {
                urlObj.searchParams.set('parent', 'localhost');
              } else {
                urlObj.searchParams.set('parent', host);
              }
              // Our sanitizer escapes specific characters to their HTML character references so convert them back so the url is valid
              updatedUrl = urlObj.href.replace('%3A', ':').replace('%2F', '/');
              return updatedUrl;
            }
            return url;
          } catch {
            return url;
          }
        };

        return {
          tagName,
          attribs: {
            ...attribs,
            src: swapParent(attribs.src, new URL(WEB_URL).host),
          },
        };
      },
    },
  });
};
