const toDom = require('../src/backend/utils/html/dom');
const removeDevToFullscreen = require('../src/backend/utils/html/remove-devto-fullscreen');

test('should remove Dev.to Enter Fullscreen RSS bug: https://github.com/forem/forem/pull/11268', () => {
  const initial = `
  <div><pre class="hljs php"><code></code></pre><div><div>
      Enter fullscreen mode



      Exit fullscreen mode



  </div></div></div>`;

  const expected = `<div><pre class="hljs php"><code></code></pre></div>`;

  const dom = toDom(initial);
  removeDevToFullscreen(dom);
  expect(dom.window.document.body.innerHTML).toEqual(expected);
});
