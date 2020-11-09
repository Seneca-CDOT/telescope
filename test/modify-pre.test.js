const toDOM = require('../src/backend/utils/html/dom');
const fixEmptyPre = require('../src/backend/utils/html/modify-pre');

function fixEmpties(htmlData) {
  const dom = toDOM(htmlData);
  fixEmptyPre(dom);
  return dom.window.document.body.innerHTML;
}

describe('modify empty pre tag tests', () => {
  test('html body without pre tags should not be changed', () => {
    const og = '<p>Hello World</p>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags with inner <code></code> elements should not be changed', () => {
    const og = '<pre><code>console.log("Hello World")</code></pre>';
    const res = fixEmpties(og);
    expect(res).toEqual(og);
  });

  test('pre tags without inner <code></code> elements should be fixed', () => {
    const og = '<pre>console.log("Hello World")</pre>';
    const res = fixEmpties(og);
    const fix = '<pre><code>console.log("Hello World")</code></pre>';
    expect(res).toEqual(fix);
  });

  test('pre tags without inner <code></code> elements should be fixed', () => {
    const og = `<pre>theme: ThemeData(
      primarySwatch: Colors.blue,
      accentColor: Colors.red,
      scaffoldBackgroundColor: Colors.black,
      textTheme: TextTheme(
        //Title
        headline1: TextStyle(color: Colors.white, fontSize: 22, fontWeight:FontWeight.w800),
        //Author
        bodyText1: TextStyle(color: Colors.white, fontSize: 23,fontWeight: FontWeight.w800,),
        //Information
        bodyText2: TextStyle(color: Colors.grey, fontSize: 20, letterSpacing: 0.9),
      ),
    ),</pre>`;
    const res = fixEmpties(og);
    const fix = `<pre><code>theme: ThemeData(
      primarySwatch: Colors.blue,
      accentColor: Colors.red,
      scaffoldBackgroundColor: Colors.black,
      textTheme: TextTheme(
        //Title
        headline1: TextStyle(color: Colors.white, fontSize: 22, fontWeight:FontWeight.w800),
        //Author
        bodyText1: TextStyle(color: Colors.white, fontSize: 23,fontWeight: FontWeight.w800,),
        //Information
        bodyText2: TextStyle(color: Colors.grey, fontSize: 20, letterSpacing: 0.9),
      ),
    ),</code></pre>`;
    expect(res).toEqual(fix);
  });
});
