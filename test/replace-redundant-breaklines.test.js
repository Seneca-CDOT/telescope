const replaceBreaklines = require('../src/backend/utils/html/replace-redundant-breaklines');

describe('Replace redundant breaklines', () => {
  test('Replace multiple <br> elements with one', () => {
    const htmlData = `<br><br>
---
<br>
<br>
---
<br>

<br>
---
<br><br><br>
<br>

<br><br>`;

    const htmlDataAfter = replaceBreaklines(htmlData);

    const expectedHtml = `<br>
---
<br>
---
<br>
---
<br>`;

    expect(htmlDataAfter).toEqual(expectedHtml);
  });

  test('Replace <br> elements in <p> and <div> elements with a single <br>', () => {
    const htmlData = `<div><br></div>
---
<div>

<br></div>

<div><br>
</div>

<div>
  <br>
</div>
---
<p>
  <br>
</p>
<p>
  <br>
</p>`;

    const htmlDataAfter = replaceBreaklines(htmlData);

    const expectedHtml = `<br>
---
<br>
---
<br>`;
    expect(htmlDataAfter).toEqual(expectedHtml);
  });
});
