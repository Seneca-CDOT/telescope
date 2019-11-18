// Sanitizes HTML and prevents XSS attacks using DOMPurify
// eg. DOMPurify.sanitize('<img src=x onerror=alert(1)//>'); // becomes <img src="x">

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

module.exports.run = async function (text) {
  const { window } = new JSDOM('');
  const DOMPurify = createDOMPurify(window);
  return Promise.resolve(DOMPurify.sanitize(text));
}