import hljs from 'highlight.js/lib/highlight';

// Tweak the language list here, see https://highlightjs.org/usage/
import cpp from 'highlight.js/lib/languages/cpp';
import sql from 'highlight.js/lib/languages/sql';
import powershell from 'highlight.js/lib/languages/powershell';
import cs from 'highlight.js/lib/languages/cs';
import go from 'highlight.js/lib/languages/go';
import css from 'highlight.js/lib/languages/css';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import swift from 'highlight.js/lib/languages/swift';
import armasm from 'highlight.js/lib/languages/armasm';
import diff from 'highlight.js/lib/languages/diff';
import python from 'highlight.js/lib/languages/python';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import http from 'highlight.js/lib/languages/http';
import typescript from 'highlight.js/lib/languages/typescript';
import ini from 'highlight.js/lib/languages/ini';
import bash from 'highlight.js/lib/languages/bash';
import nginx from 'highlight.js/lib/languages/nginx';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import rust from 'highlight.js/lib/languages/rust';
import json from 'highlight.js/lib/languages/json';
import x86asm from 'highlight.js/lib/languages/x86asm';
import kotlin from 'highlight.js/lib/languages/kotlin';
import xml from 'highlight.js/lib/languages/xml';
import shell from 'highlight.js/lib/languages/shell';
import yaml from 'highlight.js/lib/languages/yaml';
import php from 'highlight.js/lib/languages/php';
import dos from 'highlight.js/lib/languages/dos';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('cs', cs);
hljs.registerLanguage('go', go);
hljs.registerLanguage('css', css);
hljs.registerLanguage('makefile', makefile);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('armasm', armasm);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('python', python);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('http', http);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('json', json);
hljs.registerLanguage('x86asm', x86asm);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('php', php);
hljs.registerLanguage('dos', dos);

export default function (node) {
  if (node) {
    // We're moving to doing this in the backend, so skip if it's already done.
    // We'll rip this out once there's a way to trigger a rebuild of all post content.
    node.querySelectorAll('pre:not(.hljs)').forEach((pre) => hljs.highlightBlock(pre));
  }
}
