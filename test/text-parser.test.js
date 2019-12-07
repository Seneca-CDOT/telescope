const textParser = require('../src/backend/utils/text-parser');

/**
 * textParser.parse() will convert the html to text plain
 * Function should only extract what in the body
 */
test('Testing text-parser with basic document', async () => {
  const result = await textParser.parse('<!DOCTYPE html><p>Hello World</p>', page);
  expect(result).toBe('Hello World');
});

test('Testing text-parser with new line', async () => {
  const content = `
  <!DOCTYPE html>
    <html>
      <head>
        <title>OSD600</title>
      </head>
      <body style = "text-align:center;">
        <h1>Seneca</h1>
        <div>OpenSource Telescope</div>
      </body>
  </html>
  `;
  const result = await textParser.parse(content, page);
  expect(result).toBe('Seneca\nOpenSource Telescope');
});

test('Testing text-parser with Document Fragment', async () => {
  const result = await textParser.parse('<p>OSD600</p>', page);
  expect(result).toBe('OSD600');
});

test('Testing text-parser with a dictionary', async () => {
  const result = await textParser.parse({ dictKey: 'dictValue' }, page);
  expect(result).toBe('[object Object]');
});

test('Testing text-parser with an integer', async () => {
  const result = await textParser.parse(234423, page);
  expect(result).toBe('234423');
});

test('Testing text-parser with a float', async () => {
  const result = await textParser.parse(2323.12, page);
  expect(result).toBe('2323.12');
});

test('Testing text-parser with a string', async () => {
  const result = await textParser.parse('blahblajdklsfj', page);
  expect(result).toBe('blahblajdklsfj');
});

test('Testing text-parser with an error object', async () => {
  const result = await textParser.parse(new Error('hey this is an error'), page);
  expect(result).toBe('[object Object]');
});

test('Testing text-parser with an array', async () => {
  const result = await textParser.parse(['item1', 2323.4, 'item3', { what: 'okay' }], page);
  expect(result).toBe('item1,2323.4,item3,[object Object]');
});

test('Testing text-parser with an error synchronously thrown', async () => {
  const result = await textParser.parse(() => {
    throw new Error('qwerty');
  }, page);
  expect(result).toBe('undefined');
});

test('Testing text-parser with an error asynchronously thrown', async () => {
  const result = await textParser.parse(() => {
    return Promise(() => {
      throw new Error('error in promise');
    });
  }, page);
  expect(result).toBe('undefined');
});
