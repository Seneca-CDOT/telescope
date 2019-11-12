const fs = require('fs').promises;
const summarize = require('../summarizer/summarize');


describe('summarize tests...', () => {
  let inputData;
  let predicted;
  let expected;

  beforeAll(async () => {
    inputData = await fs.readFile('./summarizer/input.txt', 'utf-8');
    expected = await fs.readFile('./summarizer/expected.txt', 'utf-8');
  });

  test('summarize returns expected value', async () => {
    predicted = await summarize(inputData, 5);
    return expect(predicted).toBe(expected);
  });

  test('summarize returns string', async () => expect(typeof predicted).toBe('string'));

  test('summarize returns correct number of lines', () => expect(predicted.split('.').length).toBe(6));
});
