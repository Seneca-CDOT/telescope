module.exports = function (dom) {
  const regexValue = new RegExp('u{2800}');
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('p').forEach((p) => {
    const paragraphInnerHTML = p.innerHTML;
    if (!paragraphInnerHTML.replace(regexValue, '').trim()) {
      p.remove();
    }
  });
};
