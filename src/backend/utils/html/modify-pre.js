/**
 * Take a <pre></pre> and return <pre><code>...</code></pre>
 */
function insertCodeElement(pre, document) {
  const innerElem = document.createElement('code');
  innerElem.innerText = pre.innerText;
  pre.innerHTML = innerElem.outerHTML;
}

module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('pre').forEach((pre) => {
    if (pre.children.length <= 0) insertCodeElement(pre, dom.window.document);
  });
};
