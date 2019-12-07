const sanitizeHTML = require('../src/backend/utils/sanitize-html');

describe('Sanitize HTML', () => {
  test('<img> should work, but inline js should not', () => {
    const data = sanitizeHTML('<img src="x" onerror="alert(1)" onload="alert(1)" />');
    expect(data).toBe('<img src="x" />');
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

  test('<figure> with <img> should remove <figure>', () => {
    const data = sanitizeHTML(
      '<figure class="wp-block-image size-large"><img src="https://paulopensourceblog.files.wordpress.com/2019/12/image-3.png?w=1024" alt="" class="wp-image-2226"></figure>'
    );
    expect(data).toBe(
      '<img src="https://paulopensourceblog.files.wordpress.com/2019/12/image-3.png?w=1024" />'
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
