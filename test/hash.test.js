const hash = require('../src/backend/data/hash');

describe('hash function tests', () => {
  it('should return a 10 character hash', () => {
    expect(hash('input').length).toBe(10);
  });

  it('should properly hash a string', () => {
    expect(hash('input')).toBe('yWxtW+jQih');
  });

  it('should return a different string if anything chagnes', () => {
    expect(hash('input2')).toBe('Ek2FQf89eh');
  });
});
