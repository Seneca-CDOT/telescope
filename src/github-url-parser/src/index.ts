import { extractGitHubInfo, parseGitHubUrl } from './extract-github-info';

export type GitHubInfo = {
  issues: string[];
  pullRequests: string[];
  repos: string[];
  commits: string[];
  users: string[];
};

export const htmlToUrls = (htmlString: string, parser: DOMParser): string[] => {
  const doc = parser.parseFromString(htmlString, 'text/html');

  const allGithubLinks = Array.from(
    // all links that have href that starts with 'https://github.com'
    doc.querySelectorAll("a[href^='https://github.com']"),
    (element) => (element as HTMLAnchorElement).href
  );

  return Array.from(new Set(allGithubLinks));
};

export const parseGitHubUrls = (htmlString: string, parser?: DOMParser): GitHubInfo => {
  if (!parser && !('DOMParser' in globalThis)) {
    throw new Error('Missing parser property and environment does not support DOMParser');
  }

  const urls = htmlToUrls(htmlString, parser || new globalThis.DOMParser());
  return extractGitHubInfo(urls);
};

export { extractGitHubInfo, parseGitHubUrl };
