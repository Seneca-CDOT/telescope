/**
 * @jest-environment jsdom
 */

const toDOM = require('../src/backend/utils/html/dom');
const fixWidth = require('../src/backend/utils/html/fix-iframe-width');

function fixIFrameWidth(html) {
  const dom = toDOM(html);
  fixWidth(dom);
  return dom.window.document.body.innerHTML;
}

/**
 * fixIFrameWidth() will update <iframe> elements so we can style with CSS
 */
describe('lazy-load tests', () => {
  test('Non <iframe> elements are left alone', () => {
    const original =
      '<main><section><article><div><p><span>Hello</span> <em>World</em></p></div></article></section></main>';
    const result = fixIFrameWidth(original);
    expect(result).toEqual(original);
  });

  test('empty strings are left untouched', () => {
    const original = '';
    const result = fixIFrameWidth(original);
    expect(result).toEqual(original);
  });

  test('regular prose is left untouched', () => {
    const original = 'This should stay identical.';
    const result = fixIFrameWidth(original);
    expect(result).toEqual(original);
  });

  test('An <iframe> gets wrapped in a <div>', () => {
    const original = '<iframe></iframe>';
    const result = fixIFrameWidth(original);
    expect(result).toEqual('<div class="iframe-video-wrapper"><iframe></iframe></div>');
  });

  test('Multiple <iframe>s get wrapped in their own <div>', () => {
    const original = '<iframe></iframe> <iframe></iframe>';
    const result = fixIFrameWidth(original);
    expect(result).toEqual(
      '<div class="iframe-video-wrapper"><iframe></iframe></div> <div class="iframe-video-wrapper"><iframe></iframe></div>'
    );
  });
});
