const textParser = require('../src/backend/utils/text-parser');

/**
 * textParser.run() will convert the html to text plain
 * Function should only extract what in the body
 */
test('Testing text-parser', async () => {
  const result = await textParser('<!DOCTYPE html><p>Hello World</p>');
  expect(result).toBe('Hello World');
});

test('Testing text-parser with new line', async () => {
  const result = await textParser(
    '<!DOCTYPE html><html><head><title>OSD600</title></head><body style = "text-align:center;"><h1>Seneca</h1><div>OpenSource Telescope</div></body></html>'
  );
  expect(result).toBe('Seneca\nOpenSource Telescope');
});

test('Testing text-parser with Document Fragment', async () => {
  const result = await textParser('<p>OSD600</p>');
  expect(result).toBe('OSD600');
});
