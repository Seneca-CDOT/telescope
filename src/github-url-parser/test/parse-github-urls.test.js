const parseGitHubUrl = require('../src/parse-github-url');

describe('parseGitHubUrl', () => {
  test('Should return null for invalid URLs', () => {
    expect(parseGitHubUrl('http://github .com')).toBe(null);
  });

  test('Should return null for non-GitHub URLs', () => {
    expect(parseGitHubUrl('http://yahoo.com')).toBe(null);
  });

  test('Should extract correct pathname', () => {
    const url =
      'https://github.com/Seneca-CDOT/telescope/pull/2367/commits/d3fagd3fagd3fagd3fagd3fagd3fag4d41265748';
    expect(parseGitHubUrl(url).pathname).toEqual(
      '/Seneca-CDOT/telescope/pull/2367/commits/d3fagd3fagd3fagd3fagd3fagd3fag4d41265748'
    );
  });

  test('Should extract correct hostname', () => {
    const url =
      'https://github.com/Seneca-CDOT/telescope/pull/2367/commits/d3fagd3fagd3fagd3fagd3fagd3fag4d41265748';
    expect(parseGitHubUrl(url).hostname).toEqual('github.com');
  });
});
