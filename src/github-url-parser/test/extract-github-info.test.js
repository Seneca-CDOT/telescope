const { extractGitHubInfo, parseGitHubUrl } = require('../dist/main');

describe('extractGitHubInfo', () => {
  test('Should deal with non-GitHub URLs', () => {
    const urls = ['https://github.com/Seneca-CDOT/telescope', 'https://yahoo.com'];
    expect(extractGitHubInfo(urls).repos).toEqual(['Seneca-CDOT/telescope']);
  });

  test('Should deal with bare GitHub URL', () => {
    const urls = ['https://github.com'];
    expect(extractGitHubInfo(urls).repos).toEqual([]);
  });

  test('Should extract correct repos without duplicates', () => {
    const urls = [
      'https://github.com/Seneca-CDOT/telescope',
      'https://github.com/Seneca-CDOT/telescope',
      'https://github.com/Seneca-CDOT/satellite',
    ];
    expect(extractGitHubInfo(urls).repos).toEqual([
      'Seneca-CDOT/telescope',
      'Seneca-CDOT/satellite',
    ]);
  });

  test('Should extract correct issues without duplicates', () => {
    const urls = [
      'https://github.com/Seneca-CDOT/telescope/issues/3452',
      'https://github.com/Seneca-CDOT/telescope/issues/3452',
      'https://github.com/Seneca-CDOT/telescope/issues/3453',
    ];
    expect(extractGitHubInfo(urls).issues).toEqual([
      '/Seneca-CDOT/telescope/issues/3452',
      '/Seneca-CDOT/telescope/issues/3453',
    ]);
  });

  test('Should extract correct pull requests without duplicates', () => {
    const urls = [
      'https://github.com/Seneca-CDOT/telescope/pull/3456',
      'https://github.com/Seneca-CDOT/telescope/pull/3456',
      'https://github.com/Seneca-CDOT/telescope/pull/3457',
    ];
    expect(extractGitHubInfo(urls).pullRequests).toEqual([
      '/Seneca-CDOT/telescope/pull/3456',
      '/Seneca-CDOT/telescope/pull/3457',
    ]);
  });

  test('Should extract correct commits without duplicates', () => {
    const urls = [
      'https://github.com/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
      'https://github.com/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
      'https://github.com/Seneca-CDOT/telescope/commit/009ce528dc10102d92431bf1fa62905cd3607834',
    ];
    expect(extractGitHubInfo(urls).commits).toEqual([
      '/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
      '/Seneca-CDOT/telescope/commit/009ce528dc10102d92431bf1fa62905cd3607834',
    ]);
  });

  test('Should extract correct users without duplicates', () => {
    const urls = [
      'https://github.com/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
      'https://github.com/Seneca-CDOT/telescope/commit/009ce528dc10102d92431bf1fa62905cd3607834',
    ];
    expect(extractGitHubInfo(urls).users).toEqual(['Seneca-CDOT']);
  });

  test('Should ignore GitHub URLs with reserved word', () => {
    const urls = ['https://github.com/trending'];
    expect(extractGitHubInfo(urls).users).toEqual([]);
  });

  test('Should return all proper data for a list of GitHub URLs', () => {
    const urls = [
      // Issue
      'https://github.com/Seneca-CDOT/telescope/issues/3452',
      // Pull Request
      'https://github.com/Seneca-CDOT/telescope/pull/3456',
      // Commit
      'https://github.com/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
    ];
    expect(extractGitHubInfo(urls)).toEqual({
      users: ['Seneca-CDOT'],
      repos: ['Seneca-CDOT/telescope'],
      commits: [
        '/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b',
      ],
      issues: ['/Seneca-CDOT/telescope/issues/3452'],
      pullRequests: ['/Seneca-CDOT/telescope/pull/3456'],
    });
  });
});

describe('parseGitHubUrl', () => {
  test('Should return null for invalid URLs', () => {
    expect(() => parseGitHubUrl('http://github .com')).toThrow();
  });

  test('Should return null for non-GitHub URLs', () => {
    expect(() => parseGitHubUrl('http://yahoo.com')).toThrow();
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
