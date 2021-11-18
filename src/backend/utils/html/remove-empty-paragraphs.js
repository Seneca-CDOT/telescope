const cleanWhiteSpace = require('clean-whitespace');

module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('p').forEach((p) => {
    p.innerHTML = cleanWhiteSpace(p.innerHTML);
    const paragraphInnerHTML = p.innerHTML;
    if (
      !paragraphInnerHTML.replace(/&nbsp;/gm, '').trim() ||
      paragraphInnerHTML.trim() === '<br>'
    ) {
      p.remove();
    }
  });
};
