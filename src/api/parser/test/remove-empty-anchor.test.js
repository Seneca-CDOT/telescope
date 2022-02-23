const toDom = require('../src/utils/html/dom');
const removeEmptyAnchor = require('../src/utils/html/remove-empty-anchor');

function removeNoContentAnchor(html) {
  const dom = toDom(html);
  removeEmptyAnchor(dom);
  return dom.window.document.body.innerHTML;
}

/**
 * removeNoContentAnchor() will remove all anchors that have no content
 * but keep those that include media tags
 */
describe('Remove no content anchor tags', () => {
  // Test to see if <a></a> get removed
  test('Should remove <a></a> when outer div is empty', () => {
    const HTMLBefore = '<div><a></a></div>';
    const HTMLAfter = removeNoContentAnchor(HTMLBefore);
    const HTMLExpected = '<div></div>';

    expect(HTMLAfter).toEqual(HTMLExpected);
  });

  test('Should remove <a></a> when outer is not empty', () => {
    const HTMLBefore = '<div><a></a> This is the content of the outer div</div>';
    const HTMLAfter = removeNoContentAnchor(HTMLBefore);
    const HTMLExpected = '<div> This is the content of the outer div</div>';

    expect(HTMLAfter).toEqual(HTMLExpected);
  });
  // Anchor tags with text content should not be removed
  test('Should not remove <a>foo</a> ', () => {
    const htmlData = '<div><a>foo</a></div>';
    const htmlDataAfter = removeNoContentAnchor(htmlData);

    expect(htmlDataAfter).toEqual(htmlData);
  });

  // Anchor tags with text content and href attribute should not be removed
  test('Should not remove <a href="http://localhost">localhost</a> or <a href="#abc">abc</a>', () => {
    const firstHtmlData = '<div><a href="http://localhost">localhost</a></div>';
    const firstHtmlDataAfter = removeNoContentAnchor(firstHtmlData);

    const secondHtmlData = '<div><a href="#abc">abc</a></div>';
    const secondHtmlDataAfter = removeNoContentAnchor(secondHtmlData);

    expect(firstHtmlDataAfter).toEqual(firstHtmlData);
    expect(secondHtmlDataAfter).toEqual(secondHtmlData);
  });

  // Show recognize empty anchors in a sequence of anchors
  test('Should only keep third anchor in <a></a><a></a><a>should still exist</a>', () => {
    const htmlData = '<a></a><a></a><a>should still exist</a>';
    const htmlDataAfter = removeNoContentAnchor(htmlData);
    const htmlDataExpected = '<a>should still exist</a>';
    expect(htmlDataAfter).toEqual(htmlDataExpected);
  });

  describe('Should keep anchors contain media tags only', () => {
    // Should not remove anchor if it contain a single media tag. Media tags include 'img', 'audio', 'video', 'picture', 'svg', 'object', 'map', 'iframe', 'embed'
    test.each`
      name                                                       | anchorElement
      ${'Should not remove anchors containing single <img>'}     | ${'<div><a><img src="Image.com"></a></div>'}
      ${'Should not remove anchors containing single <audio>'}   | ${'<div><a><audio></audio></a></div>'}
      ${'Should not remove anchors containing single <video>'}   | ${'<div><a><video></video></a></div>'}
      ${'Should not remove anchors containing single <picture>'} | ${'<div><picture></picture></div>'}
      ${'Should not remove anchors containing single <svg>'}     | ${'<div><svg></svg></div>'}
      ${'Should not remove anchors containing single <object>'}  | ${'<div><object></object></div>'}
      ${'Should not remove anchors containing single <map>'}     | ${'<div><map></map></div>'}
      ${'Should not remove anchors containing single <iframe>'}  | ${'<div><iframe></iframe></div>'}
      ${'Should not remove anchors containing single <embed>'}   | ${'<div><embed></div>'}
    `('$name', ({ anchorElement }) => {
      expect(removeNoContentAnchor(anchorElement)).toBe(anchorElement);
    });

    // Should not remove anchor if it contain multiple media tags
    test('Should not remove anchors containing multiple media tags eg: <a><img><video></video><audio></audio></a>', () => {
      const htmlData = '<div><a><img><video></video><audio></audio></a></div>';
      const htmlDataAfter = removeNoContentAnchor(htmlData);

      expect(htmlDataAfter).toEqual(htmlData);
    });
  });
});
