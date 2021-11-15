const process = require('../src/backend/utils/html/index');

describe('Process HTML', () => {
  test('Unknown tags within code tag should be stay the same', () => {
    const content = `<div>Hello<code>&lt;Hello&gt; &lt;HelloWorld/&gt;  &lt;/HelloWorld2&gt;</code></div>`;
    const expectedData = `<div>Hello<code>&lt;Hello&gt; &lt;HelloWorld/&gt;  &lt;/HelloWorld2&gt;</code></div>`;
    const data = process(content);
    expect(data).toBe(expectedData);
  });

  test('https://github.com/Seneca-CDOT/telescope/issues/2313', () => {
    const data = process(
      `<pre><code>const html = data.replace (/^## (.*$)/gim, '&lt;h2&gt;$1&lt;/h2&gt;')</code></pre>`
    );
    const expectedData = `<pre><code class="hljs language-typescript"><span class="hljs-keyword">const</span> html = data.<span class="hljs-property">replace</span> (<span class="hljs-regexp">/^## (.*$)/gim</span>, <span class="hljs-string">'&lt;h2&gt;$1&lt;/h2&gt;'</span>)</code></pre>`;
    expect(data).toBe(expectedData);
  });

  test('https://github.com/Seneca-CDOT/telescope/issues/2220', () => {
    const data = process(
      `<div><pre><code>&lt;img src={slackLogo} alt="logo"/&gt;</code></pre></div>`
    );
    const expectedData =
      '<div><pre><code class="hljs language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{slackLogo}</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">"logo"</span>/&gt;</span></code></pre></div>';
    expect(data).toBe(expectedData);
  });

  test('Double escape character stay the same', () => {
    const data = process(`<code>&amp;&amp; &amp;&lt;</code>`);
    const expectedData = `<code>&amp;&amp; &amp;&lt;</code>`;
    expect(data).toBe(expectedData);
  });

  test('Escape character stay the same', () => {
    const data = process(`<code>&amp;lt; ;&amp;</code>`);
    const expectedData = `<code>&amp;lt; ;&amp;</code>`;
    expect(data).toBe(expectedData);
  });

  test('https://github.com/Seneca-CDOT/telescope/issues/1091', () => {
    const data = process(`<code>['12', ...].map((number) =&gt;;
    twilio.messages.create({
      body: '...'
    </code>`);
    const expectedData = `<code>['12', ...].map((number) =&gt;;
    twilio.messages.create({
      body: '...'
    </code>`;
    expect(data).toBe(expectedData);
  });
});
