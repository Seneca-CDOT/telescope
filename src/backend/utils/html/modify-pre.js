/**
 * Take a <pre>...</pre> and return <pre><code>...</code></pre>
 */
function insert(pre, document) {
  const codeElem = document.createElement('code');
  codeElem.innerHTML = pre.innerHTML;
  pre.innerHTML = codeElem.outerHTML;
}
/**
 * Given a parsed JSDOM Object. find all <pre></pre> tags without child code elements and modify the
 * Pre tag to have inner <code></code> tags which wraps around the previous content
 * resulting in <pre><code>...</code></pre>
 */
module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('pre').forEach((pre) => {
    // no child elements
    if (pre.children.length <= 0) insert(pre, dom.window.document);
    // has child <br> elements
    else if (pre.children.length > 0 && pre.children[0].nodeName === 'BR') {
      pre.innerHTML = pre.innerHTML.replace(/<br>/g, '\n'); // trim
      insert(pre, dom.window.document);
    }
  });
};
