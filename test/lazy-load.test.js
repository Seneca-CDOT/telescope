/**
 * @jest-environment jsdom
 */

const toDOM = require('../src/backend/utils/html/dom');
const lazy = require('../src/backend/utils/html/lazy-load');

function lazyLoad(html) {
  const dom = toDOM(html);
  lazy(dom);
  return dom.window.document.body.innerHTML;
}

/**
 * lazyLoad() will update <img> and <iframe> elements to use loading="lazy"
 */
describe('lazy-load tests', () => {
  test('Non <img> and <iframe> elements are left alone', () => {
    const original =
      '<main><section><article><div><p><span>Hello</span> <em>World</em></p></div></article></section></main>';
    const result = lazyLoad(original);
    expect(result).toEqual(original);
  });

  test('empty strings are left untouched', () => {
    const original = '';
    const result = lazyLoad(original);
    expect(result).toEqual(original);
  });

  test('regular prose is left untouched', () => {
    const original = 'This should stay identical.';
    const result = lazyLoad(original);
    expect(result).toEqual(original);
  });

  describe('<img> lazy loading', () => {
    test('An <img> has lazy loading added', () => {
      const original = '<img src="dog.jpg">';
      const result = lazyLoad(original);
      expect(result).toEqual('<img src="dog.jpg" loading="lazy">');
    });

    test('An <img> has lazy loading added only once', () => {
      const original = '<img src="dog.jpg" loading="lazy">';
      const result = lazyLoad(original);
      expect(result).toEqual('<img src="dog.jpg" loading="lazy">');
    });

    test('Multiple <img>s have lazy loading added', () => {
      const original = '<img src="dog.jpg"> <img src="cat.jpg">';
      const result = lazyLoad(original);
      expect(result).toEqual(
        '<img src="dog.jpg" loading="lazy"> <img src="cat.jpg" loading="lazy">'
      );
    });
  });

  describe('<iframe> lazy loading', () => {
    test('An <iframe> has lazy loading added', () => {
      const original = '<iframe src="index.html"></iframe>';
      const result = lazyLoad(original);
      expect(result).toEqual('<iframe src="index.html" loading="lazy"></iframe>');
    });

    test('An <iframe> has lazy loading added only once', () => {
      const original = '<iframe src="index.html" loading="lazy"></iframe>';
      const result = lazyLoad(original);
      expect(result).toEqual('<iframe src="index.html" loading="lazy"></iframe>');
    });

    test('Multiple <iframe>s have lazy loading added', () => {
      const original =
        '<iframe src="one.html" loading="lazy"></iframe> <iframe src="two.html" loading="lazy"></iframe>';
      const result = lazyLoad(original);
      expect(result).toEqual(original);
    });
  });
});
