/**
 * @jest-environment jsdom
 */

const toDOM = require('../src/backend/utils/html/dom');

function isDOM(dom) {
  return !!(dom && dom.window && dom.window.document && dom.window.document.body);
}

/**
 * toDOM() produces a JSDOM from HTML strings
 */
describe('toDOM tests', () => {
  test('an HTML string is turned into a DOM', () => {
    const original =
      '<main><section><article><div><p><span>Hello</span> <em>World</em></p></div></article></section></main>';
    const result = toDOM(original);
    expect(isDOM(result)).toBe(true);
    expect(result.window.document.body.innerHTML).toEqual(original);
  });

  test('empty strings are OK', () => {
    const original = '';
    const result = toDOM(original);
    expect(isDOM(result)).toBe(true);
  });

  test('regular prose is OK', () => {
    const original = 'This should work';
    const result = toDOM(original);
    expect(isDOM(result)).toBe(true);
  });
});
