const toDom = require('../src/backend/utils/html/dom');
const removeBraille = require('../src/backend/utils/html/remove-zero-dot-braille');

test('should remove <p>⠀⠀⠀⠀</p> (braille)', () => {
  const htmlData = toDom('<div><p></p></div>');
  removeBraille(htmlData);

  const expectedHtml = '<div></div>';
  expect(htmlData.window.document.body.innerHTML).toEqual(expectedHtml);
});
