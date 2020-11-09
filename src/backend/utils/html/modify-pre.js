/**
 * Take a <pre>...</pre> and return <pre><code>...</code></pre>
 */
function insertCodeElement(pre, document) {
  const innerElem = document.createElement('code');
  innerElem.innerHTML = pre.innerHTML;
  pre.innerHTML = innerElem.outerHTML;
}
/**
 * Given a parsed JSDOM Object. find all <pre></pre> tags without child code elements and modify the
 * pre tag to have inner <code></code> tags which wraps around the previous content
 * resulting in <pre><code>...</code></pre>
 */
module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('pre').forEach((pre) => {
    // if pre has no child elements
    if (pre.children.length <= 0) insertCodeElement(pre, dom.window.document);

    // pre has child nodes but they are <br> tags
    if (pre.hasChildNodes() && pre.children[0].nodeName == 'BR')
      insertCodeElement(pre, dom.window.document);
  });
};
