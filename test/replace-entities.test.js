const toDOM = require('../src/backend/utils/html/dom');
const replaceEntity = require('../src/backend/utils/html/replace-entities');

function decodeHTML(html) {
  const dom = toDOM(html);
  return replaceEntity(dom, html);
}

test('Encoded string with no entities should not be changed', () => {
  const htmlData = '<p><b>Hello World</b></p>';
  const data = decodeHTML(htmlData);
  expect(data).toBe('<p><b>Hello World</b></p>');
});

test('Encoded string with non-breaking space entities should be decoded', () => {
  const htmlData =
    '<p><b>Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet,&nbsp;consectetur&nbsp;adipiscing&nbsp;elit.</b></p>';
  const data = decodeHTML(htmlData);
  expect(data).toBe(
    '<p><b>Lorem\xa0ipsum\xa0dolor\xa0sit\xa0amet,\xa0consectetur\xa0adipiscing\xa0elit.</b></p>'
  );
});

test('Encoded string with greater than sign should be decoded twice (double encoded)', () => {
  const htmlData = `
    <code>
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
  const data = decodeHTML(htmlData);
  expect(data).toBe(`
    <code>
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
    </code>`);
});

test('Encoded string with less than sign should be decoded twice (double encoded)', () => {
  const htmlData = `
    <code>
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
  const data = decodeHTML(htmlData);
  expect(data).toBe(`
    <code>
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
    </code>`);
});

test('Encoded string with ampersand entities should be decoded', () => {
  const htmlData =
    '<p><b>Lorem&amp;ipsum&amp;dolor&amp;sit&amp;amet,&amp;consectetur&amp;adipiscing&amp;elit.</b></p>';
  const data = decodeHTML(htmlData);
  expect(data).toBe('<p><b>Lorem&ipsum&dolor&sit&amet,&consectetur&adipiscing&elit.</b></p>');
});

// test('test to see if the string can get rid of double quote', () => {

// });

// test('test to see if the string can get rid of single quote', () => {

// });

// test('test to see if the string can get rid of apostrophe', () => {

// });

test('Encoded string with arrow function should be decoded', () => {
  const htmlData = `
    <span class="hljs-string">', ...].map((number) =&gt;;
      twilio.messages.create({
        body: '...'
    </span>`;
  const data = decodeHTML(htmlData);
  expect(data).toBe(`
    <span class="hljs-string">', ...].map((number) =>;
      twilio.messages.create({
        body: '...'
    </span>`);
});

test('Encoded string with &amp;gt; should be decoded twice (double encoded)', () => {
  const htmlData = `
    <code>
      <span class="hljs-symbol">&amp;gt;</span>
      <span class="hljs-symbol">&amp;gt;</span>
      <span class="hljs-symbol">&amp;gt;</span> import gus\n
      <span class="hljs-symbol">&amp;gt;</span>
      <span class="hljs-symbol">&amp;gt;</span>
      <span class="hljs-symbol">&amp;gt;</span> gus.tavo('example.html')\n
    </code>`;
  const data = decodeHTML(htmlData);
  expect(data).toBe(`
    <code>
      <span class="hljs-symbol">></span>
      <span class="hljs-symbol">></span>
      <span class="hljs-symbol">></span> import gus\n
      <span class="hljs-symbol">></span>
      <span class="hljs-symbol">></span>
      <span class="hljs-symbol">></span> gus.tavo('example.html')\n
    </code>`);
});
