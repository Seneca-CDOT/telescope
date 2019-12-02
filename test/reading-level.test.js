const readingLevel = require('../src/backend/utils/reading-level');

describe('Reading level checks', () => {
  test('Analysis of text should return unrounded complexity of 2.879999999999999', async () => {
    readingLevel('this is a simple sentence').then(result => {
      expect(result.unrounded).toBe(2.879999999999999);
    });
  });

  test('Analysis of text should return unrounded complexity of 20.854285714285712', async () => {
    readingLevel('the perpendicular platypus perused the panoramic pyramid').then(result => {
      expect(result.unrounded).toBe(20.854285714285712);
    });
  });

  test('Analysis of text should return error', async () => {
    readingLevel('0120131908 74123987419823').then(result => {
      expect(result.error).toBe(!null);
    });
  });

  test('Analysis of text should return error', async () => {
    readingLevel('').then(result => {
      expect(result.error).toBe(!null);
    });
  });
});
