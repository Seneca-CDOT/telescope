const hash = require('../src/backend/data/hash');

describe('hash function tests', () => {
  it('should return a 10 character hash', () => {
    expect(hash('input').length).toBe(10);
  });

  it('should properly hash a string', () => {
    expect(hash('input')).toBe('c96c6d5be8');
  });

  it('should return a different string if anything changes', () => {
    expect(hash('input2')).toBe('124d8541ff');
  });
});
