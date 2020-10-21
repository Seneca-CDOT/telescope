const toDom = require('../src/backend/utils/html/dom');
const removeEmptyAnchor = require('../src/backend/utils/html/remove-empty-anchor');

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
  test('Should remove <a></a> ', () => {
    const firstHTMLBefore = '<div><a></a></div>';
    const firstHTMLAfter = removeNoContentAnchor(firstHTMLBefore);
    const firstHTMLExpected = '<div></div>';

    const secondHTMLBefore = '<div><a></a> This is the content of the outer div</div>';
    const secondHTMLAfter = removeNoContentAnchor(secondHTMLBefore);
    const secondHTMLExpected = '<div> This is the content of the outer div</div>';

    expect(firstHTMLAfter).toEqual(firstHTMLExpected);
    expect(secondHTMLAfter).toEqual(secondHTMLExpected);
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
    test('Should not remove anchors containing single media tag eg: <a><img src="Image.com"></a>', () => {
      const withImg = '<div><a><img src="Image.com"></a></div>';
      const withAudio = '<div><a><audio></audio></a></div>';
      const withVideo = '<div><a><video></video></a></div>';
      const withPicture = '<div><picture></picture></div>';
      const withSvg = '<div><svg></svg></div>';
      const withObject = '<div><object></object></div>';
      const withMap = '<div><map></map></div>';
      const withIframe = '<div><iframe></iframe></div>';
      const withEmbed = '<div><embed></div>';

      const withImgAfter = removeNoContentAnchor(withImg);
      const withAudioAfter = removeNoContentAnchor(withAudio);
      const withVideoAfter = removeNoContentAnchor(withVideo);
      const withPictureAfter = removeNoContentAnchor(withPicture);
      const withSvgAfter = removeNoContentAnchor(withSvg);
      const withObjectAfter = removeNoContentAnchor(withObject);
      const withMapAfter = removeNoContentAnchor(withMap);
      const withIframeAfter = removeNoContentAnchor(withIframe);
      const withEmbedAfter = removeNoContentAnchor(withEmbed);

      expect(withImgAfter).toEqual(withImg);
      expect(withAudioAfter).toEqual(withAudio);
      expect(withVideoAfter).toEqual(withVideo);
      expect(withPictureAfter).toEqual(withPicture);
      expect(withSvgAfter).toEqual(withSvg);
      expect(withObjectAfter).toEqual(withObject);
      expect(withMapAfter).toEqual(withMap);
      expect(withIframeAfter).toEqual(withIframe);
      expect(withEmbedAfter).toEqual(withEmbed);
    });

    // Should not remove anchor if it contain multiple media tags
    test('Should not remove anchors containing multiple media tags eg: <a><img><video></video><audio></audio></a>', () => {
      const htmlData = '<div><a><img><video></video><audio></audio></a></div>';
      const htmlDataAfter = removeNoContentAnchor(htmlData);

      expect(htmlDataAfter).toEqual(htmlData);
    });
  });
});
