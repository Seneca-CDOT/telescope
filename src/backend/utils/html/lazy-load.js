/**
 * Given a parsed JSDOM Object, find all <img> and <iframe> elements and add
 * the native lazy load attribute, `loading="lazy"`.
 */
module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document
    .querySelectorAll('iframe, img')
    .forEach((elem) => elem.setAttribute('loading', 'lazy'));
};
