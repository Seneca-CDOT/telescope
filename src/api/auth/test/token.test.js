const jwt = require('jsonwebtoken');
const { createToken } = require('../src/token');

const { JWT_AUDIENCE, JWT_ISSUER, SECRET } = process.env;

describe('createToken()', () => {
  it('should return a valid JWT', () => {
    const token = createToken('email', 'name');
    const { sub, name } = jwt.verify(token, SECRET);
    expect(sub).toBe('email');
    expect(name).toBe('name');
  });

  it('should return a JWT with the expected sub claim', () => {
    const token = createToken('email', 'name');
    const { sub } = jwt.verify(token, SECRET);
    expect(sub).toBe('email');
  });

  it('should return a JWT with the expected name claim', () => {
    const token = createToken('email', 'name');
    const { name } = jwt.verify(token, SECRET);
    expect(name).toBe('name');
  });

  it('should return a JWT with the expected "seneca" roles claim', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { roles } = jwt.verify(token, SECRET);
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBe(1);
    expect(roles[0]).toEqual('seneca');
  });

  it('should return a JWT with the expected "seneca" and "telescope" roles claim', () => {
    const token = createToken('email', 'name', ['seneca', 'telescope']);
    const { roles } = jwt.verify(token, SECRET);
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBe(2);
    expect(roles).toContain('seneca');
    expect(roles).toContain('telescope');
  });

  it('should return a JWT with the expected "seneca" and "telescope" and "admin" roles claim', () => {
    const token = createToken('email', 'name', ['seneca', 'telescope', 'admin']);
    const { roles } = jwt.verify(token, SECRET);
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBe(3);
    expect(roles).toContain('seneca');
    expect(roles).toContain('telescope');
    expect(roles).toContain('admin');
  });

  it('should return a JWT with the expected audience claim', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { aud } = jwt.verify(token, SECRET);
    expect(aud).toBe(JWT_AUDIENCE);
  });

  it('should return a JWT with the expected issuer claim', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { iss } = jwt.verify(token, SECRET);
    expect(iss).toBe(JWT_ISSUER);
  });

  it('should return a JWT with an expiry claim', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { exp } = jwt.verify(token, SECRET);
    expect(typeof exp === 'number').toBe(true);
    // The expiry time should be in the future
    const nowSeconds = Date.now() / 1000;
    expect(exp).toBeGreaterThan(nowSeconds);
  });

  it('should return a JWT with an issued at claim', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { iat } = jwt.verify(token, SECRET);
    expect(typeof iat === 'number').toBe(true);
    // The issued at time should be in the past
    const nowSeconds = Date.now() / 1000;
    expect(iat).toBeLessThan(nowSeconds);
  });

  it('should return a JWT without the picture claim, if picture not defined', () => {
    const token = createToken('email', 'name', ['seneca']);
    const { picture } = jwt.verify(token, SECRET);
    expect(picture).toBe(undefined);
  });

  it('should return a JWT with the picture claim, if picture defined', () => {
    const token = createToken('email', 'name', ['seneca'], 'http://picture.com');
    const { picture } = jwt.verify(token, SECRET);
    expect(picture).toEqual('http://picture.com');
  });
});
