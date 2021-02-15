const jwt = require('jsonwebtoken');
const { createToken } = require('../src/token');

const { JWT_AUDIENCE, JWT_ISSUER, SECRET } = process.env;

describe('createToken()', () => {
  it('should return a valid JWT', () => {
    const token = createToken('subject');
    const { sub } = jwt.verify(token, SECRET);
    expect(sub).toBe('subject');
  });

  it('should return a JWT with the expected audience claim', () => {
    const token = createToken('subject');
    const { aud } = jwt.verify(token, SECRET);
    expect(aud).toBe(JWT_AUDIENCE);
  });

  it('should return a JWT with the expected issuer claim', () => {
    const token = createToken('subject');
    const { iss } = jwt.verify(token, SECRET);
    expect(iss).toBe(JWT_ISSUER);
  });

  it('should return a JWT with an expiry claim', () => {
    const token = createToken('subject');
    const { exp } = jwt.verify(token, SECRET);
    expect(typeof exp === 'number').toBe(true);
    // The expiry time should be in the future
    const nowSeconds = Date.now() / 1000;
    expect(exp).toBeGreaterThan(nowSeconds);
  });

  it('should return a JWT with an issued at claim', () => {
    const token = createToken('subject');
    const { iat } = jwt.verify(token, SECRET);
    expect(typeof iat === 'number').toBe(true);
    // The issued at time should be in the past
    const nowSeconds = Date.now() / 1000;
    expect(iat).toBeLessThan(nowSeconds);
  });
});
