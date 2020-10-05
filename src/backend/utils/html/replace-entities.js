const entities = require('entities');

function decode(codeElement) {
  // decode twice for double encoded entities
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
  return String(fixedCodeElement); // return result to the tests
};
