/**
 * Take an <iframe> and return <div><iframe></div>
 */
function wrap(iframe, document) {
  const wrapper = document.createElement('div');
  wrapper.className = 'iframe-video-wrapper';

  iframe.parentNode.insertBefore(wrapper, iframe);
  wrapper.appendChild(iframe);
}

/**
 * Given a parsed JSDOM Object, find all <iframe> elements and add
 * an enclosing <div class="iframe-video-wrapper"> so we can control
 * the width of the iframe.
 */
module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document
    .querySelectorAll('iframe')
    .forEach((iframe) => wrap(iframe, dom.window.document));
};
