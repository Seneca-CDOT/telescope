const { matchOrigin } = require('../src/util');

describe('matchOrigin()', () => {
  it('should match an exact origin', () => {
    const allowedOrigins = ['http://localhost:8000'];
    expect(matchOrigin('http://localhost:8000', allowedOrigins)).toBe(true);
  });

  it('should match an origin with a * wildcard', () => {
    const allowedOrigins = ['http://*.localhost'];
    expect(matchOrigin('http://dev.localhost', allowedOrigins)).toBe(true);
  });

  it('should reject an exact origin that is not allowed', () => {
    const allowedOrigins = ['http://localhost:9000'];
    expect(matchOrigin('http://localhost:1234', allowedOrigins)).toBe(false);
  });

  it('should reject a fuzzy matched origin that is not allowed', () => {
    const allowedOrigins = ['http://*.localhost'];
    expect(matchOrigin('https://google.com', allowedOrigins)).toBe(false);
  });

  it('should support the Vercel preview PR case', () => {
    const allowedOrigins = ['https://*-humphd.vercel.app/', 'https://dev.telescope.cdot.systems'];
    expect(matchOrigin('https://telescope-pzgueymdv-humphd.vercel.app/', allowedOrigins)).toBe(
      true
    );
  });

  it('should support the Telescope cases', () => {
    const allowedOrigins = [
      'https://*-humphd.vercel.app/',
      'https://dev.telescope.cdot.systems',
      'https://telescope.cdot.systems',
    ];
    expect(matchOrigin('https://dev.telescope.cdot.systems', allowedOrigins)).toBe(true);
    expect(matchOrigin('https://telescope.cdot.systems', allowedOrigins)).toBe(true);
  });

  it('should fail similar cases to our Telescope cases', () => {
    const allowedOrigins = [
      'https://*-humphd.vercel.app/',
      'https://dev.telescope.cdot.systems',
      'https://telescope.cdot.systems',
    ];
    // No https
    expect(matchOrigin('http://dev.telescope.cdot.systems', allowedOrigins)).toBe(false);
    // Different sub-domain
    expect(matchOrigin('https://api.telescope.cdot.systems', allowedOrigins)).toBe(false);
    // Different Vercel domain
    expect(
      matchOrigin('https://telescope-pzgueymdv-someone-else.vercel.app/', allowedOrigins)
    ).toBe(false);
  });
});
