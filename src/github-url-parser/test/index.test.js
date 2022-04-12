const githubUrlParser = require('../src');
const { parser } = require('./util');

describe('githubUrlParser', () => {
  test('Should throw if missing DOMParser', () => {
    expect(() => githubUrlParser('abc')).toThrow();
  });

  test('Should return expected GitHub Info for a string of HTML', () => {
    const html = `
      <a href="https://github.com/Seneca-CDOT/telescope/pull/3456">Telescope PR #3456</a>
      <a href="https://github.com/Seneca-CDOT/telescope/issues/3452">Telescope Issue #3452</a>
      <a href="https://github.com/Seneca-CDOT/telescope/pull/3455/commits/82f16594caa2d81442accd2a891a3d514f2ff39b">Telescope PR commit 82f1659</a>
      `;
    expect(githubUrlParser(html, parser())).toEqual({
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
