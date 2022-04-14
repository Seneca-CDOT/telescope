import { GitHubInfo } from '.';
import reservedNames from './reserved-names';

export const parseGitHubUrl = (url: string): URL => {
  const ghUrl = new URL(url);
  if (ghUrl.hostname !== 'github.com') {
    throw new Error('expected github.com URL');
  }
  return ghUrl;
};

export const extractGitHubInfo = (gitHubUrls: string[]): GitHubInfo => {
  const issues = new Set<string>();
  const pullRequests = new Set<string>();
  const repos = new Set<string>();
  const commits = new Set<string>();
  const users = new Set<string>();

  gitHubUrls
    .map((url) => {
      try {
        return parseGitHubUrl(url);
      } catch (_) {
        return null!;
      }
    })
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
