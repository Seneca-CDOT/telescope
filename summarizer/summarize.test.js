const fs = require('fs');
const summarize = require('./summarize');

describe('summarize tests...', () => {
  const text = fs.readFileSync('./summarizer/text.txt', 'utf-8');
  let data;

  it('summarize returns string', async () => {
    data = await summarize(text, 5);
    expect(typeof data).toBe('string');
  });

  it('summarize returns correct number of lines', () => {
    expect(data.split('.').length).toBe(6);
  });
});
