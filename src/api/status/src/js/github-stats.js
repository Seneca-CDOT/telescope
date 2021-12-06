const { fetch } = require('@senecacdot/satellite');

const fetchGitHubApi = (owner, repo, path) =>
  fetch(`https://api.github.com/repos/${owner}/${repo}/${path}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

module.exports = async function getGitHubData(owner, repo) {
  const returnedValue = {};

  // get weekly commits for last year: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-count
  try {
    const res = await fetchGitHubApi(owner, repo, 'stats/participation');
    const participationResponse = await res.json();

    if (!res.ok) throw new Error(`[Error ${res.status}] - ${participationResponse.message}`);

    returnedValue.weeklyCommits = {
      commits: participationResponse.all[participationResponse.all.length - 1],
    };
    returnedValue.yearlyCommits = {
      commits: participationResponse.all.reduce((a, b) => a + b),
    };
  } catch (error) {
    console.error(error);
  }

  // get weekly commits activity: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-activity
  try {
    const res = await fetchGitHubApi(owner, repo, 'stats/code_frequency');
    const codeFrequencyResponse = await res.json();

    if (!res.ok) throw new Error(`[Error ${res.status}] - ${codeFrequencyResponse.message}`);

    const [, linesAdded, linesRemoved] = codeFrequencyResponse[codeFrequencyResponse.length - 1];
    returnedValue.weeklyCommits = { linesAdded, linesRemoved, ...returnedValue.weeklyCommits };
  } catch (error) {
    console.error(error);
  }

  // get latest author from commits list: https://docs.github.com/en/rest/reference/repos#list-commits
  try {
    const res = await fetchGitHubApi(owner, repo, 'commits');
    const commitResponse = await res.json();

    if (!res.ok) throw new Error(`[Error ${res.status}] - ${commitResponse.message}`);

    const lastCommitResponse = commitResponse[0];
    returnedValue.avatar = lastCommitResponse.author.avatar_url;
    returnedValue.username = lastCommitResponse.author.login;
    returnedValue.fullName = lastCommitResponse.commit.author.name;
    returnedValue.commitURL = lastCommitResponse.html_url;
    returnedValue.shortSha = lastCommitResponse.sha.substr(0, 7);
    returnedValue.usernameURL = `https://github.com/${lastCommitResponse.author.login}`;
  } catch (error) {
    console.error(error);
  }

  // get total contributors: https://docs.github.com/en/rest/reference/repos#list-repository-contributors
  try {
    const res = await fetchGitHubApi(owner, repo, 'contributors?per_page=1');

    if (res.status >= 400) throw new Error(`[Error ${res.status}] - ${(await res.json()).message}`);

    const contributorsResponse = await res.headers.get('link');
    [, returnedValue.totalContributors] = contributorsResponse.match(
      /.*"next".*&page=([0-9]*).*"last".*/
    );
  } catch (error) {
    console.error(error);
  }

  return returnedValue;
};
