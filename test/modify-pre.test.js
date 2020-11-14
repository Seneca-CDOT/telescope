const toDOM = require('../src/backend/utils/html/dom');
const fixEmptyPre = require('../src/backend/utils/html/modify-pre');

function fixEmpties(htmlData) {
  const dom = toDOM(htmlData);
  fixEmptyPre(dom);
  return dom.window.document.body.innerHTML;
}

describe('modify pre tag without <code> element tests', () => {
  test('html body without pre tags should not be changed', () => {
    const og = '<p>Hello World</p>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags with inner <code></code> elements should not be changed', () => {
    const og = '<pre><code>console.log("Hello World")</code></pre>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags without inner <code></code> elements should be fixed', () => {
    const og = '<pre>console.log("Hello World")</pre>';
    const res = fixEmpties(og);
    const fix = '<pre><code>console.log("Hello World")</code></pre>';
    expect(res).toEqual(fix);
  });

  test('pre tag with child <br> elements should be fixed', () => {
    const og = '<pre><br>console.log("Hello World")<br></pre>';
    const res = fixEmpties(og);
    const fix = '<pre><code>\nconsole.log("Hello World")\n</code></pre>';
    expect(res).toEqual(fix);
  });
});
