const parseGitHubUrl = require('./parse-github-url');
const reservedNames = require('./reserved-names');

module.exports = (gitHubUrls) => {
  const issues = new Set();
  const pullRequests = new Set();
  const repos = new Set();
  const commits = new Set();
  const users = new Set();

  gitHubUrls
    .map((url) => parseGitHubUrl(url))
    .filter(Boolean)
    .filter((url) => !reservedNames.includes(url.pathname.split('/').slice(1, 2)[0]))
    .forEach((url) => {
      const { pathname } = url;

      // Match urls that start with /<user> and optionally end with /<repo> or /<repo>/<anything-in-between>/<type>/<id>
      // <id> can be number, or a mixed of 40 alphanumeric (commit id)
      // Ex: /Seneca-CDOT/telescope/pull/2367 ✅
      // Ex: /Seneca-CDOT/telescope ✅
      // Ex: /Seneca-CDOT/telescope/pull/2367/commits/d3fagd3fagd3fagd3fagd3fagd3fag4d41265748 ✅
      // Ex: /Seneca-CDOT/telescope/issues ✅
      const matches =
        /^\/(?<user>[^/]+)(\/(?<repo>[^/]+)((\/(.*))?(\/(?<type>[^/]+)?\/(?<id>(\d+|\w{40}))\/?$))?)?/gi.exec(
          pathname
        );

      if (!matches?.groups) {
        return;
      }

      const { type, user, repo } = matches.groups;

      if (repo) {
        const repoUrl = `${user}/${repo}`;
        repos.add(repoUrl);
      }

      users.add(user);

      switch (type?.toLowerCase()) {
        case 'pull':
          pullRequests.add(pathname);
          break;
        case 'issues':
          issues.add(pathname);
          break;
        case 'commit':
        case 'commits':
          commits.add(pathname);
          break;
        default:
          break;
      }
    });

  return {
    repos: Array.from(repos),
    issues: Array.from(issues),
    pullRequests: Array.from(pullRequests),
    commits: Array.from(commits),
    users: Array.from(users),
  };
};
