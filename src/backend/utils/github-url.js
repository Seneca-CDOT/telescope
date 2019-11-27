require('../lib/config');
const parseGithubUrl = require('parse-github-url');
const fetch = require('node-fetch');

const githubAPI = 'http://api.github.com';

const isValidGithubUrl = ghUrl =>
  ghUrl.protocol === 'https:' &&
  ghUrl.host === 'github.com' &&
  (ghUrl.branch !== 'issues' || ghUrl.branch !== 'pull' || ghUrl.branch !== 'master');

/**
 * @description Takes a url, checks if it's a valid github url
 * and returns JSON with fetched data related to the url from Github's V3 API.
 * At the moment, it accepts URLs of repositories, issues and pull requests.
 * @link https://developer.github.com/v3/
 * @param {string} url Url that will be processed.
 * @return An object with all the fetched data.
 */
exports.getGithubUrlData = async incomingUrl => {
  const ghUrl = parseGithubUrl(incomingUrl);

  if (!isValidGithubUrl(ghUrl)) {
    throw new Error('Invalid GitHub url');
  }

  let subUrl = '';

  /**
   * If repo is null, it's a user URL.
   * The request needs to be format this way:
   * GET /users/:user
   */
  if (ghUrl.repo === null) subUrl = `/users/${ghUrl.path}`;
  /**
   * If branch is master and there's a repo,
   * it's repo URL:
   * GET /repos/:user/:repo
   */ else if (ghUrl.branch === 'master') subUrl = `/repos/${ghUrl.repo}`;
  /**
   * Otherwise it's a {pull request, issue} URL:
   * GET /repos/:user/:repo/{issues, pulls}
   */ else
    subUrl = ghUrl.branch === 'pull' ? `/repos/${ghUrl.repo}/pulls` : `/repos/${ghUrl.repo}/issues`;

  /**
   * Add the {issue,pull request} number at the end of the request:
   * GET /repos/:owner/:repo/{issues, pulls}/:{issue, pull_number}
   */
  subUrl += ghUrl.filepath !== null ? `/${ghUrl.filepath}` : '';

  /**
   * Add GITHUB_TOKEN if in process.env
   */
  subUrl +=
    typeof process.env.GITHUB_TOKEN !== 'undefined'
      ? `?access_token=${process.env.GITHUB_TOKEN}`
      : '';

  return fetch(`${githubAPI}${subUrl}`)
    .then(res => res.json())
    .then(data => {
      let fetchedData;

      /**
       * Format the fetched data in a specifi way depending if the url
       * is for a repo, user or for a {pull request, issue}
       */
      // User
      if (ghUrl.repo === null) {
        const { login: user, avatar_url: avatarURL, name, company, blog, email, bio } = data;

        fetchedData = {
          user,
          avatarURL,
          name,
          company,
          blog,
          email,
          bio,
        };

        // Repo
      } else if (ghUrl.branch === 'master') {
        const {
          owner: { avatar_url: avatarURL },
          description,
          license,
          open_issues: openIssues,
          forks,
          created_at: createdAt,
          language,
        } = data;

        fetchedData = {
          avatarURL,
          description,
          license,
          openIssues,
          forks,
          createdAt,
          language,
        };

        // Issue or Pull Request
      } else {
        const {
          user: { login, avatar_url: avatarURL },
          body,
          created_at: createdAt,
        } = data;

        fetchedData = {
          login,
          avatarURL,
          body,
          createdAt,
          branch: ghUrl.branch,
          repo: ghUrl.name,
        };
      }
      return fetchedData;
    });
};
