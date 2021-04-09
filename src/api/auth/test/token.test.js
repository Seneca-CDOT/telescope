/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const { hash } = require('@senecacdot/satellite');

const { createToken } = require('../src/token');

const { JWT_AUDIENCE, JWT_ISSUER, SECRET } = process.env;

const token = () =>
  createToken('email', 'first', 'last', 'name', ['seneca', 'telescope'], 'picture');

describe('createToken()', () => {
  it('should return a JWT with the expected sub claim', () => {
    const { sub } = jwt.verify(token(), SECRET);
    // sub should be the hashed email value
    expect(sub).toBe(hash('email'));
  });

  it('should return a JWT with the expected email claim', () => {
    const { email } = jwt.verify(token(), SECRET);
    expect(email).toBe('email');
  });

  it('should return a JWT with the expected given_name claim', () => {
    const { given_name } = jwt.verify(token(), SECRET);
    expect(given_name).toBe('first');
  });

  it('should return a JWT with the expected family_name claim', () => {
    const { family_name } = jwt.verify(token(), SECRET);
    expect(family_name).toBe('last');
  });

  it('should return a JWT with the expected name claim', () => {
    const { name } = jwt.verify(token(), SECRET);
    expect(name).toBe('name');
  });

  it('should return a JWT with the expected "seneca" roles claim', () => {
    const { roles } = jwt.verify(token(), SECRET);
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBe(2);
    expect(roles).toEqual(['seneca', 'telescope']);
  });

  it('should return a JWT with the expected "seneca" and "telescope" and "admin" roles claim', () => {
    const { roles } = jwt.verify(
      createToken('email', 'first', 'last', 'name', ['seneca', 'telescope', 'admin'], 'picture'),
      SECRET
    );
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBe(3);
    expect(roles).toContain('seneca');
    expect(roles).toContain('telescope');
    expect(roles).toContain('admin');
  });

  it('should return a JWT with the expected audience claim', () => {
    const { aud } = jwt.verify(token(), SECRET);
    expect(aud).toBe(JWT_AUDIENCE);
  });

  it('should return a JWT with the expected issuer claim', () => {
    const { iss } = jwt.verify(token(), SECRET);
    expect(iss).toBe(JWT_ISSUER);
  });

  it('should return a JWT with an expiry claim', () => {
    const { exp } = jwt.verify(token(), SECRET);
    expect(typeof exp === 'number').toBe(true);
    // The expiry time should be in the future
    const nowSeconds = Date.now() / 1000;
    expect(exp).toBeGreaterThan(nowSeconds);
  });

  it('should return a JWT with an issued at claim', () => {
    const { iat } = jwt.verify(token(), SECRET);
    expect(typeof iat === 'number').toBe(true);
    // The issued at time should be in the past
    const nowSeconds = Date.now() / 1000;
    expect(iat).toBeLessThan(nowSeconds);
  });

  it('should return a JWT without the picture claim, if picture not defined', () => {
    const { picture } = jwt.verify(
      createToken('email', 'first', 'last', 'name', ['seneca', 'telescope']),
      SECRET
    );
    expect(picture).toBe(undefined);
  });

  it('should return a JWT with the picture claim, if picture defined', () => {
    const { picture } = jwt.verify(
      createToken('email', 'first', 'last', 'name', ['seneca', 'telescope'], 'https://picture.com'),
      SECRET
    );
    expect(picture).toEqual('https://picture.com');
  });
});
