const sanitizeHTML = require('../src/backend/utils/html/sanitize');

describe('Sanitize HTML', () => {
  test('<script> should be removed', () => {
    const data = sanitizeHTML('<p>Hello <script>console.log("world")</script></p>');
    expect(data).toBe('<p>Hello </p>');
  });

  test('https://github.com/Seneca-CDOT/telescope/issues/1488', () => {
    // Regex is rendered as plain text
    const data = sanitizeHTML('<code>(<br>(s?)+?){2,}</code>');
    expect(data).toBe('<code>(<br />(s?)+?){2,}</code>');

    // Script in a code block is removed
    const xss = sanitizeHTML(
      `<code>harmless text <br><script>alert("test");</script>regex example: (<br>.*<br>)</code>`
    );
    expect(xss).toBe(`<code>harmless text <br />regex example: (<br />.*<br />)</code>`);
  });

  test('<img> should work, but inline js should not', () => {
    const data = sanitizeHTML('<img src="x" onerror="alert(1)" onload="alert(1)" />');
    expect(data).toBe('<img src="x" />');
  });

  // note: any sort of image type is accepted using a data URI (.png, .gif, .jpg, etc.)
  test('<img src="data:..."/> URI links (gif based) should be accepted (i.e. not sanitized)', () => {
    const data = sanitizeHTML(
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />'
    );
    expect(data).toBe(
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />'
    );
  });

  test('img links over https should be accepted (i.e. not sanitized)', () => {
    const data = sanitizeHTML(
      '<p><a><img src="https://www.telescope.com/https_image.jpg" /></a></p>'
    );
    expect(data).toBe('<p><a><img src="https://www.telescope.com/https_image.jpg" /></a></p>');
  });

  // this test might break everything in the future as Chrome moves towards blocking mixed content. see: https://web.dev/what-is-mixed-content/
  test('img links over http should be accepted (i.e. not sanitized)', () => {
    const data = sanitizeHTML(
      '<p><a><img src="http://www.telescope.com/http_image.jpg" /></a></p>'
    );
    expect(data).toBe('<p><a><img src="http://www.telescope.com/http_image.jpg" /></a></p>');
  });

  test('protocoless urls should be accepted (i.e. not sanitized)', () => {
    const data = sanitizeHTML('<img src="//www.telescope.com/image.jpg" />');
    expect(data).toBe('<img src="//www.telescope.com/image.jpg" />');
  });

  test('<a><img> should work, but inline js should not', () => {
    const data = sanitizeHTML(
      '<a href="https://www.telescope.com"><img border="0" alt="W3Schools" src="logo.gif" width="100" height="100"></a>'
    );
    expect(data).toBe('<a href="https://www.telescope.com"><img src="logo.gif" /></a>');
  });

  test('<p> with inline style, sanitize strips inline style', () => {
    const data = sanitizeHTML('<p style="color:blue;font-size:46px;">Here is color blue</p>');
    expect(data).toBe('<p>Here is color blue</p>');
  });

  test('<p> with <strong> should work with inline style stripped', () => {
    const data = sanitizeHTML(
      '<p style="color:blue;font-size:46px;">Here is color <strong>blue</strong></p>'
    );
    expect(data).toBe('<p>Here is color <strong>blue</strong></p>');
  });

  test('<figure> with <img> should strip inline style as both are added to allowed tags', () => {
    const data = sanitizeHTML(
      '<figure class="wp-block-image size-large"><img src="https://paulopensourceblog.files.wordpress.com/2019/12/image-3.png?w=1024" alt="" class="wp-image-2226"></figure>'
    );
    expect(data).toBe(
      '<figure><img src="https://paulopensourceblog.files.wordpress.com/2019/12/image-3.png?w=1024" /></figure>'
    );
  });

  test('<iframe> to Telescope returns an empty iframe tag', () => {
    const data = sanitizeHTML(
      '<iframe src="https://www.telescope.com" style="border:none;">Telescope</iframe>'
    );
    expect(data).toBe('<iframe>Telescope</iframe>');
  });

  test('<iframe> tag to a youtube embed should not get removed', () => {
    const data = sanitizeHTML('<iframe src="https://www.youtube.com/embed/nGeKSiCQkPw"></iframe>');
    expect(data).toBe('<iframe src="https://www.youtube.com/embed/nGeKSiCQkPw"></iframe>');
  });

  test('<iframe> tag to a vimeo player should not get removed', () => {
    const data = sanitizeHTML('<iframe src="https://player.vimeo.com/video/395927811"></iframe>');
    expect(data).toBe('<iframe src="https://player.vimeo.com/video/395927811"></iframe>');
  });

  test('<iframe> tag to a giphy embed should not get removed', () => {
    const data = sanitizeHTML('<iframe src="https://giphy.com/embed/3osxYc2axjCJNsCXyE"></iframe>');
    expect(data).toBe('<iframe src="https://giphy.com/embed/3osxYc2axjCJNsCXyE"></iframe>');
  });

  test('<iframe> tag to a spotify embed should not get removed', () => {
    const data = sanitizeHTML(
      '<iframe src="https://open.spotify.com/embed/album/21wMUhXhWLew2zsWQhlYEM?referrer=https%3A%2F%2Fmedium.com%2F%40pedrofonsecadev%2Ftelescope-note-feb-22-2021-8601dfbaa1f0"></iframe>'
    );
    expect(data).toBe(
      '<iframe src="https://open.spotify.com/embed/album/21wMUhXhWLew2zsWQhlYEM?referrer=https%3A%2F%2Fmedium.com%2F%40pedrofonsecadev%2Ftelescope-note-feb-22-2021-8601dfbaa1f0"></iframe>'
    );
  });

  test('cdn.embedly.com embedded content should not get removed', () => {
    const data = sanitizeHTML(
      '<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fopen.spotify.com%2Fembed%2Falbum%2F21wMUhXhWLew2zsWQhlYEM&amp;display_name=Spotify&amp;url=https%3A%2F%2Fopen.spotify.com%2Falbum%2F21wMUhXhWLew2zsWQhlYEM&amp;image=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d00001e02142b21bd73f912e8dfd72ade&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=spotify"></iframe>'
    );
    expect(data).toBe(
      '<iframe src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fopen.spotify.com%2Fembed%2Falbum%2F21wMUhXhWLew2zsWQhlYEM&amp;display_name=Spotify&amp;url=https%3A%2F%2Fopen.spotify.com%2Falbum%2F21wMUhXhWLew2zsWQhlYEM&amp;image=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d00001e02142b21bd73f912e8dfd72ade&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;type=text%2Fhtml&amp;schema=spotify"></iframe>'
    );
  });

  test('medium.com embedded content including Gist code should not get removed', () => {
    const data = sanitizeHTML(
      '<iframe src="https://medium.com/media/e19a2999dc5dcb71e7a5ad152fdb2a2a"></iframe>'
    );
    expect(data).toBe(
      '<iframe src="https://medium.com/media/e19a2999dc5dcb71e7a5ad152fdb2a2a"></iframe>'
    );
  });

  test('<pre> with inline style, sanitize strips inline style', () => {
    const data = sanitizeHTML('<pre class="brush: plain; title: ; notranslate">Hello World</pre>');
    expect(data).toBe('<pre>Hello World</pre>');
  });

  test('<table> with multiple tags and links should work', () => {
    const data = sanitizeHTML(
      '<table cellpadding="0" align="center" style="margin-left: auto; margin-right: auto; text-align: center;" cellspacing="0" class="tr-caption-container"><tbody><tr><td style="text-align: center;"><a style="margin-left: auto; margin-right: auto;" href="www.senecacollege.ca"><img src="https://1.bp.blogspot.com/11.JPG" height="640" border="0" width="592"></a></td></tr><tr><td style="text-align: center;" class="tr-caption">The Final Product</td></tr></tbody></table>'
    );
    expect(data).toBe(
      '<table><tbody><tr><td><a href="www.senecacollege.ca"><img src="https://1.bp.blogspot.com/11.JPG" /></a></td></tr><tr><td>The Final Product</td></tr></tbody></table>'
    );
  });
});
