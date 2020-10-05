const toDOM = require('../src/backend/utils/html/dom');
const replaceEntity = require('../src/backend/utils/html/replace-entities');

function decodeHTML(htmlData) {
  const dom = toDOM(htmlData);
  let fixedCodeElement = replaceEntity(dom);
  fixedCodeElement = `<code>${fixedCodeElement}</code>`;
  const encodedHtml = dom.window.document.body.innerHTML;
  return Array.from([fixedCodeElement, encodedHtml]);
}

test('Encoded string with no code block entities should not be changed', () => {
  const htmlData = '<code><p><b>Hello World</b></p></code>';
  const decoded = '<code><p><b>Hello World</b></p></code>';
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(htmlData);
});

test('Encoded string with non-breaking space entities should be decoded', () => {
  const htmlData =
    '<code><p><b>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.</b></p></code>';
  const decoded =
    '<code><p><b>Lorem\xa0ipsum\xa0dolor\xa0sit\xa0amet,\xa0consectetur\xa0adipiscing\xa0elit.</b></p></code>';
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(htmlData);
});

test('Encoded string with greater than sign should be decoded twice (double encoded)', () => {
  const htmlData = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length &amp;gt; 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i &amp;gt; yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const encodedHtml = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length &gt; 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i &gt; yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const decoded = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length > 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i > yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(encodedHtml);
});

test('Encoded string with less than sign should be decoded twice (double encoded)', () => {
  const htmlData = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length &amp;lt; 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i &amp;lt; yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const encodedHtml = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length &lt; 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i &lt; yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const decoded = `<code>
    <span class="hljs-comment">// if -f filename.txt, take all files and put into the files variables.</span>
    <span class="hljs-keyword">if</span> (yargs.argv._.length < 
    <span class="hljs-number">1</span>) {
    <span class="hljs-keyword">for</span> (
    <span class="hljs-keyword">let</span> i = 
    <span class="hljs-number">1</span>; i < yargs.argv._.length; i++) {
        files.push(yargs.argv._[i]);
      }
    }
  }
  </code>`;
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(encodedHtml);
});

test('Encoded string with ampersand entities should be decoded', () => {
  const htmlData =
    '<code><p><b>Lorem&amp;ipsum&amp;dolor&amp;sit&amp;amet,&amp;consectetur&amp;adipiscing&amp;elit.</b></p></code>';
  const decoded =
    '<code><p><b>Lorem&ipsum&dolor&sit&amet,&consectetur&adipiscing&elit.</b></p></code>';
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(htmlData);
});

test('Encoded string with arrow function should be decoded', () => {
  const htmlData = `<code>
    <span class="hljs-string">', ...].map((number) =&gt;;
      twilio.messages.create({
        body: '...'
    </span>
  </code>`;
  const decoded = `<code>
    <span class="hljs-string">', ...].map((number) =>;
      twilio.messages.create({
        body: '...'
    </span>
  </code>`;
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(htmlData);
});

test('Encoded string with &amp;gt; should be decoded twice (double encoded)', () => {
  const htmlData = `<code>
    <span class="hljs-symbol">&amp;gt;</span>
    <span class="hljs-symbol">&amp;gt;</span>
    <span class="hljs-symbol">&amp;gt;</span> import gus\n
    <span class="hljs-symbol">&amp;gt;</span>
    <span class="hljs-symbol">&amp;gt;</span>
    <span class="hljs-symbol">&amp;gt;</span> gus.tavo('example.html')\n
  </code>`;
  const encodedHtml = `<code>
    <span class="hljs-symbol">&gt;</span>
    <span class="hljs-symbol">&gt;</span>
    <span class="hljs-symbol">&gt;</span> import gus\n
    <span class="hljs-symbol">&gt;</span>
    <span class="hljs-symbol">&gt;</span>
    <span class="hljs-symbol">&gt;</span> gus.tavo('example.html')\n
  </code>`;
  const decoded = `<code>
    <span class="hljs-symbol">></span>
    <span class="hljs-symbol">></span>
    <span class="hljs-symbol">></span> import gus\n
    <span class="hljs-symbol">></span>
    <span class="hljs-symbol">></span>
    <span class="hljs-symbol">></span> gus.tavo('example.html')\n
  </code>`;
  const data = decodeHTML(htmlData);
  expect(Array.isArray(data)).toBe(true);
  expect(data[0]).toBe(decoded);
  expect(data[1]).toBe(encodedHtml);
});
