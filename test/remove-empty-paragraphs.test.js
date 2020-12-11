const toDom = require('../src/backend/utils/html/dom');
const removeEmptyParagraphs = require('../src/backend/utils/html/remove-empty-paragraphs');

describe('Remove no content anchor tags', () => {
  test('should remove <p></p>', () => {
    const htmlData = toDom('<div><p></p></div>');
    removeEmptyParagraphs(htmlData);

    const expectedHtml = '<div></div>';
    expect(htmlData.window.document.body.innerHTML).toEqual(expectedHtml);
  });

  test('should remove <p>   </p> (spaces)', () => {
    const htmlData = toDom('<div><p>   </p></div>');
    removeEmptyParagraphs(htmlData);

    const expectedHtml = '<div></div>';
    expect(htmlData.window.document.body.innerHTML).toEqual(expectedHtml);
  });

  test('should remove <p>     </p> (tabs)', () => {
    const htmlData = toDom('<div><p>      </p></div>');
    removeEmptyParagraphs(htmlData);

    const expectedHtml = '<div></div>';
    expect(htmlData.window.document.body.innerHTML).toEqual(expectedHtml);
  });
});
