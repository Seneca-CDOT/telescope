const htmlToUrls = require('../src/html-to-urls');
const { parser } = require('./util');

describe('htmlToUrls', () => {
  test('should find a GitHub URL in an <a>', () => {
    const html = '<a href="https://github.com/Seneca-CDOT/telescope">Telescope</a>';
    const urls = htmlToUrls(html, parser());
    expect(urls).toEqual(['https://github.com/Seneca-CDOT/telescope']);
  });

  test('should skip duplicate URLs', () => {
    const html =
      '<a href="https://github.com/Seneca-CDOT/telescope">Telescope</a><a href="https://github.com/Seneca-CDOT/telescope">Telescope</a>';
    const urls = htmlToUrls(html, parser());
    expect(urls).toEqual(['https://github.com/Seneca-CDOT/telescope']);
  });

  test('should skip non-GitHub URLs', () => {
    const html = '<a href="https://not.github.com/">Not GitHub</a>';
    const urls = htmlToUrls(html, parser());
    expect(urls).toEqual([]);
  });
});
