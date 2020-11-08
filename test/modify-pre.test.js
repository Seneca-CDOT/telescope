const toDOM = require('../src/backend/utils/html/dom');
const fixEmptyPre = require('../src/backend/utils/html/modify-pre');

function fixEmpties(htmlData) {
  const dom = toDOM(htmlData);
  fixEmptyPre(dom);
  return dom.window.document.body.innerHTML;
}

describe('modify empty pre tag tests', () => {
  test('html body without pre tags should not be changed', () => {
    const og = '<html><head><title>A title</title></head><body><p>Hello World</p></body></html>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags with inner <code></code> elements should not be changed', () => {
    const og =
      '<html><head><title>A title</title></head><body><pre><code>console.log("Hello World")</code></pre></body></html>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags without inner <code></code> elements should be fixed', () => {
    const og =
      '<html><head><title>A title</title></head><body><pre>console.log("Hello World")</pre></body></html>';
    const res = fixEmpties(og);
    const fix =
      '<html><head><title>A title</title></head><body><pre><code>console.log("Hello World")</code></pre></body></html>';
    expect(res).toEqual(fix);
  });
});
