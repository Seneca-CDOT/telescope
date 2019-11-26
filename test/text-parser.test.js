const textParser = require('../src/text-parser');

/**
 * textParser.run() will convert the html to text plain
 * Function should only extract what in the body
 */
test('Testing text-parser', async () => {
  const result = await textParser.run('<!DOCTYPE html><p>Hello World</p>');
  expect(result).toBe('Hello World');
});

test.skip('Testing text-parser with new line', async () => {
  const result = await textParser.run(
    '<!DOCTYPE html><html><head><title>OSD600</title></head><body style = "text-align:center;"><h1>Seneca</h1><div>OpenSource Telescope</div></body></html>'
  );
  expect(result).toBe('Seneca\nOpenSource Telescope');
});
