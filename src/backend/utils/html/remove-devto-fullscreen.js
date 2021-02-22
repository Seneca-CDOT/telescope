// Temporary fix for upstream bug in dev.to articles including the text
// "Enter fullscreen mode Exit fullscreen mode" in RSS feeds.
//
// Issue: https://github.com/forem/forem/issues/10927
// Pull Request: https://github.com/forem/forem/pull/11268

module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  // Look for all <pre class="hljs">...</pre><div><div>Enter fullscreen....</div></div>
  dom.window.document.querySelectorAll('pre.hljs + div > div').forEach((elem) => {
    if (elem.innerHTML.includes('Enter fullscreen mode')) {
      elem.parentNode.remove();
    }
  });
};
