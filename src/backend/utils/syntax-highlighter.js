const hljs = require('highlight.js/lib/highlight');
const jsdom = require('jsdom');
const { logger } = require('./logger');

const { JSDOM } = jsdom;

// Tweak the language list here, see https://highlightjs.org/usage/
hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell'));
hljs.registerLanguage('cs', require('highlight.js/lib/languages/cs'));
hljs.registerLanguage('go', require('highlight.js/lib/languages/go'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage('makefile', require('highlight.js/lib/languages/makefile'));
hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
hljs.registerLanguage('swift', require('highlight.js/lib/languages/swift'));
hljs.registerLanguage('armasm', require('highlight.js/lib/languages/armasm'));
hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'));
hljs.registerLanguage('http', require('highlight.js/lib/languages/http'));
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'));
hljs.registerLanguage('ini', require('highlight.js/lib/languages/ini'));
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'));
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('rust', require('highlight.js/lib/languages/rust'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('x86asm', require('highlight.js/lib/languages/x86asm'));
hljs.registerLanguage('kotlin', require('highlight.js/lib/languages/kotlin'));
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
hljs.registerLanguage('dos', require('highlight.js/lib/languages/dos'));

/**
 * Given a String of HTML, find all <pre>...</pre> code blocks
 * and apply syntax highlight markup.
 */
module.exports = function (html) {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    doc.querySelectorAll('pre code').forEach((code) => {
      const { value, language } = hljs.highlightAuto(code.innerHTML);

      // Decorate the <pre> with class names for highlighting this language
      const pre = code.parentNode;
      pre.classList.add('hljs', language);

      // Replace the contents with newly marked up syntax highligting
      code.innerHTML = value;
    });

    return doc.body.innerHTML;
  } catch (err) {
    logger.error({ err, html }, 'syntax highlight error');
    // Return the html untouched.
    return html;
  }
};
