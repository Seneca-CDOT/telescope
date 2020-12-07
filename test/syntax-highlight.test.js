/**
 * @jest-environment jsdom
 */

const toDOM = require('../src/backend/utils/html/dom');
const highlight = require('../src/backend/utils/html/syntax-highlight');

function syntaxHighlighter(html) {
  const dom = toDOM(html);
  highlight(dom);
  return dom.window.document.body.innerHTML;
}

/**
 * syntaxHighlighter() will markup code so it can be styled as code with CSS
 */
describe('syntax-highlight tests', () => {
  test('empty code blocks are left untouched', () => {
    const original = '';
    const result = syntaxHighlighter(original);
    expect(result).toEqual(original);
  });

  test('regular prose is left untouched', () => {
    const original = 'This should stay identical.';
    const result = syntaxHighlighter(original);
    expect(result).toEqual(original);
  });

  test('code outside <pre><code>...</code></pre> should be left untouched', () => {
    const original = 'function fn() { console.log("This should stay identical."); }\n\n';
    const result = syntaxHighlighter(original);
    expect(result).toEqual(original);
  });

  test('code inside <pre><code>...</code></pre> should get marked up', () => {
    // C# code example, in regular text and as code
    const original = 'const int i = 5; <pre><code>const int i = 5;</code></pre>';
    const result = syntaxHighlighter(original);
    const expected =
      'const int i = 5; <pre class="hljs csharp"><code><span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> i = <span class="hljs-number">5</span>;</code></pre>';
    expect(result).toEqual(expected);
  });

  test('bash is correctly marked up', () => {
    const original = '<pre><code>cd foo</code></pre>';
    const result = syntaxHighlighter(original);
    const expected =
      '<pre class="hljs powershell"><code><span class="hljs-built_in">cd</span> foo</code></pre>';
    expect(result).toEqual(expected);
  });

  test('JavaScript is correctly marked up', () => {
    const original =
      '<pre><code>import React, { Component } from "react"; function main() { console.log("hi"); }</code></pre>';
    const result = syntaxHighlighter(original);
    const expected =
      '<pre class="hljs javascript"><code><span class="hljs-keyword">import</span> React, { Component } <span class="hljs-keyword">from</span> <span class="hljs-string">"react"</span>; <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">main</span>(<span class="hljs-params"></span>) </span>{ <span class="hljs-built_in">console</span>.log(<span class="hljs-string">"hi"</span>); }</code></pre>';
    expect(result).toEqual(expected);
  });
});
