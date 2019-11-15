
const sentimentAnalysis = require('../src/sentiment-analysis');

const expected = {
  score: 1,
  comparative: 0.1111111111111111,
  calculation: [{ allergic: -2 }, { love: 3 }],
  tokens: [
    'i',
    'love',
    'cats',
    'but',
    'i',
    'am',
    'allergic',
    'to',
    'them',
  ],
  words: [
    'allergic',
    'love',
  ],
  positive: [
    'love',
  ],
  negative: [
    'allergic',
  ],
};

test('test if sample text does not return the correct object', () => sentimentAnalysis.run('I like dogs, but my girlfriend is afraid of them').then((data) => {
  expect(data).toEqual(expect.not.objectContaining(expected));
}));

test('test if sample text returns the correct object', () => sentimentAnalysis.run('I love cats, but I am allergic to them.').then((data) => {
  expect(data).toEqual(expect.objectContaining(expected));
}));


