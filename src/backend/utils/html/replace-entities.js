const entities = require('entities');

function decode(codeElement) {
  // decode twice
  console.log('replace-entities: INSIDE OF THE DECODE FUNCTION!');
  let result = entities.decodeHTML(codeElement.innerHTML);
  result = entities.decodeHTML(result);
  return result;
}
// This function is meant query code elements, decode the entities, and then change the dom with those changes
module.exports = function (dom) {
  console.log('replace-entities: INSIDE OF THE FUNCTION!');
  if (!(dom && dom.window && dom.window.document)) {
    return;
  }

  dom.window.document.querySelectorAll('code').forEach((code) => {
    console.log('replace-entities: INSIDE OF THE FOREACH FUNCTION!');
    const fixedCodeElement = decode(code);
    code.innerHTML = '';
    code.innerHTML = fixedCodeElement;
  });
};
