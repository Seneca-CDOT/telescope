const { wordCounter } = require('../src/backend/utils/word-counter');

test('counts the number of words in a 5-word long sentence', () =>
  wordCounter('one two three four five').then(data => {
    expect(data).toBe(5);
  }));
