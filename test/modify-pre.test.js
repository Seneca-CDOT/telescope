const toDOM = require('../src/backend/utils/html/dom');
const fixEmptyPre = require('../src/backend/utils/html/modify-pre');

function fixEmpties(htmlData) {
  const dom = toDOM(htmlData);
  fixEmptyPre(dom);
  return dom.window.document.body.innerHTML;
}

// describe('my test', () => {
//   test('is a test', () => {});
//   test('is not a elepahhtn', () => {});
// });
