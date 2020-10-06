const entities = require('entities');

function decode(codeElement) {
  // decode twice for double encoded html entities
  const result = entities.decodeHTML(codeElement.innerHTML);
  return entities.decodeHTML(result);
}

module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return null;
  }

  let fixedCodeElement = {};

  dom.window.document.querySelectorAll('code').forEach((code) => {
    fixedCodeElement = decode(code);
    code.innerHTML = fixedCodeElement;
  });
  return `<code>${fixedCodeElement}</code>`; // return decoded string to the tests
};
