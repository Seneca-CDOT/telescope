import { Post } from '../interfaces';
import githubReservedNames from '../githubReservedName';

export interface GitHubInfoContextInterface {
  issues: string[];
  pullRequests: string[];
  repos: string[];
  commits: string[];
  users: string[];
}

const extractGitHubUrlsFromPost = (htmlString: string): string[] => {
  const parser = new DOMParser();
  const postDoc = parser.parseFromString(htmlString, 'text/html');

  const allGithubLinks = Array.from(
    // all links that have href starts with 'https://github.com'
    postDoc.querySelectorAll("a[href^='https://github.com']"),
    (element) => (element as HTMLAnchorElement).href
  );

  // unique links only
  return allGithubLinks.reduce(
    (acc: string[], element) => (acc.includes(element) ? acc : [...acc, element]),
    []
  );
};

const parseGitHubUrl = (url: string): URL | null => {
  try {
    const ghUrl = new URL(url);
    if (ghUrl.hostname !== 'github.com') {
      return null;
    }
    return ghUrl;
  } catch (err) {
    return null;
  }
};

const fetchGitHubUrls = (extractedGitHubUrls: string[]): GitHubInfoContextInterface => {
  const issues: Set<string> = new Set();
  const pullRequests: Set<string> = new Set();
  const repos: Set<string> = new Set();
  const commits: Set<string> = new Set();
  const users: Set<string> = new Set();

  const ghUrls = (
    extractedGitHubUrls.map((url) => parseGitHubUrl(url)).filter((url) => url !== null) as URL[]
  ).filter((url) => !githubReservedNames.includes(url.pathname.split('/').slice(1, 2)[0]));

  ghUrls.forEach((url) => {
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

    if (matches?.groups) {
      const { type, user, repo } = matches.groups;

      // if repo defined add to repos
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

export const extractGitHubInfo = (post: Post): GitHubInfoContextInterface => {
  const gitHubUrls = extractGitHubUrlsFromPost(post.html);
  return fetchGitHubUrls(gitHubUrls);
};
