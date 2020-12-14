const toDom = require('../src/backend/utils/html/dom');
const replaceBreaklines = require('../src/backend/utils/html/replace-redundant-breaklines');

describe('Replace redundant breaklines', () => {
  test('Replace multiple <br> elements with one', () => {
    const htmlData = `<div>
  <br>
  <br>
  <p>text</p>
  <br>
  <br>
</div>`;

    const html = toDom(htmlData);

    replaceBreaklines(html);

    const expectedHtml = `<head></head><body><div>
  <br>
  
  <p>text</p>
  <br>
  
</div></body>`;

    expect(html.window.document.documentElement.innerHTML).toEqual(expectedHtml);
  });

  test('Remove nested single <br> elements', () => {
    const htmlData = `<div>
  <div>
    <br>
    <br>
  </div>
  <div>
    <div>
      <br>
    </div>
  </div>
  <p>text</p>
</div>`;

    const html = toDom(htmlData);

    replaceBreaklines(html);

    const expectedHtml = `<head></head><body><div>
  
  
  <p>text</p>
</div></body>`;
    expect(html.window.document.documentElement.innerHTML).toEqual(expectedHtml);
  });
});
