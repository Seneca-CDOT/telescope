const { fetch } = require('@senecacdot/satellite');

const redis = require('../redis');

const cacheTime = 60 * 10; // 10 mins of cache time

const fetchGitHubApi = (owner, repo, path) =>
  fetch(`https://api.github.com/repos/${owner}/${repo}/${path}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

const getStatsParticipation = async (owner, repo) => {
  // get weekly commits for last year: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-count
  const res = await fetchGitHubApi(owner, repo, 'stats/participation');
  const participationResponse = await res.json();
  if (!res.ok) {
    throw new Error(`[Code ${res.status}] - ${participationResponse.message}`);
  }

  return {
    weeklyCommits: {
      commits: participationResponse.all[participationResponse.all.length - 1],
    },
    yearlyCommits: {
      commits: participationResponse.all.reduce((a, b) => a + b),
    },
  };
};

const getStatsCodeFrequency = async (owner, repo) => {
  // get weekly commits activity: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-activity
  const res = await fetchGitHubApi(owner, repo, 'stats/code_frequency');
  const codeFrequencyResponse = await res.json();

  if (!res.ok) {
    throw new Error(`[Code ${res.status}] - ${codeFrequencyResponse.message}`);
  }

  const [, linesAdded, linesRemoved] = codeFrequencyResponse[codeFrequencyResponse.length - 1];
  return { weeklyCommits: { linesAdded, linesRemoved } };
};

const getCommitsInfo = async (owner, repo) => {
  // get latest author from commits list: https://docs.github.com/en/rest/reference/repos#list-commits
  const res = await fetchGitHubApi(owner, repo, 'commits');
  const commitResponse = await res.json();

  if (!res.ok) {
    throw new Error(`[Code ${res.status}] - ${commitResponse.message}`);
  }

  const lastCommitResponse = commitResponse[0];

  return {
    avatar: lastCommitResponse.author.avatar_url || '',
    username: lastCommitResponse.author.login || '',
    fullName: lastCommitResponse.commit.author.name,
    commitURL: lastCommitResponse.html_url,
    shortSha: lastCommitResponse.sha.substr(0, 7),
    usernameURL: `https://github.com/${lastCommitResponse.author.login || ''}`,
  };
};

const getContributorsInfo = async (owner, repo) => {
  // get total contributors: https://docs.github.com/en/rest/reference/repos#list-repository-contributors
  const res = await fetchGitHubApi(owner, repo, 'contributors?per_page=1');

  if (res.status >= 400) {
    throw new Error(`[Code ${res.status}] - ${(await res.json()).message}`);
  }

  const contributorsResponse = await res.headers.get('link');
  const [, totalContributors] = contributorsResponse.match(/.*"next".*&page=([0-9]*).*"last".*/);

  return {
    totalContributors,
  };
};

module.exports = async function getGitHubData(owner, repo) {
  let githubData = {};
  try {
    const cached = await redis.get(`github:info-${repo}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const [statsParticipation, statsCodeFrequency, commitsInfo, contributorsInfo] =
      await Promise.all([
        getStatsParticipation(owner, repo),
        getStatsCodeFrequency(owner, repo),
        getCommitsInfo(owner, repo),
        getContributorsInfo(owner, repo),
      ]);

    githubData = {
      weeklyCommits: { ...statsParticipation.weeklyCommits, ...statsCodeFrequency.weeklyCommits },
      yearlyCommits: { ...statsParticipation.yearlyCommits },
      ...commitsInfo,
      ...contributorsInfo,
    };

    await redis.set(`github:info-${repo}`, JSON.stringify(githubData), 'EX', cacheTime);
  } catch (err) {
    console.error(err);
  }
  return githubData;
};
