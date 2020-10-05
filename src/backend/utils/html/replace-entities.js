const entities = require('entities');

function decode(codeElement) {
  // decode twice
  const result = entities.decodeHTML(codeElement.innerHTML);
  return entities.decodeHTML(result);
}
// This function is meant query code elements, decode the entities, and then change the dom with those changes
module.exports = function (dom) {
  if (!(dom && dom.window && dom.window.document)) {
    return null;
  }

  let fixedCodeElement = {};

  dom.window.document.querySelectorAll('code').forEach((code) => {
    console.log('replace-entities: INSIDE OF THE FOREACH FUNCTION!');
    fixedCodeElement = decode(code);
    code.innerHTML = '';
    code.innerHTML = fixedCodeElement;
  });
  return String(fixedCodeElement);
};
