module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('a').forEach((a) => {
    const anchorInnerHTML = a.innerHTML;
    if (!anchorInnerHTML.trim()) {
      a.remove();
    }
  });
};
