module.exports = function (html) {
  // Cleans repeated <br> elements
  html.window.document.querySelectorAll('br + br').forEach((elem) => {
    elem.remove();
  });

  // Removes single nested <br> elements
  html.window.document.querySelectorAll('br').forEach((elem) => {
    if (!elem.parentNode.textContent.trim() && elem.parentNode.children.length === 1) {
      elem.parentNode.parentNode.removeChild(elem.parentNode);
    }
  });

  // Clean up of empty <div> elements that should only occur once
  html.window.document.querySelectorAll('div').forEach((elem) => {
    if (!elem.children.length && !elem.textContent.trim()) {
      elem.remove();
    }
  });
};
