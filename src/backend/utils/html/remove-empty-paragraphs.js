module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('p').forEach((p) => {
    const paragraphInnerHTML = p.innerHTML;
    if (!paragraphInnerHTML.replace(/&nbsp;/gm, '').trim()) {
      p.remove();
    }
  });
};
