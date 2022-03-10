const { logger } = require('@senecacdot/satellite');
const octokit = require('./octokit.js');
const redis = require('../redis.js');

const cacheTime = 60 * 10; // 10 mins of cache time

const getStatsParticipation = async (owner, repo) => {
  // get weekly commits for last year: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-count
  const participationResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/stats/participation',
    {
      owner,
      repo,
    }
  );

  return {
    weeklyCommits: {
      commits: participationResponse.data.all[participationResponse.data.all.length - 1],
    },
    yearlyCommits: {
      commits: participationResponse.data.all.reduce((a, b) => a + b),
    },
  };
};

const getStatsCodeFrequency = async (owner, repo) => {
  // get weekly commits activity: https://docs.github.com/en/rest/reference/repos#get-the-weekly-commit-activity
  const codeFrequencyResponse = await octokit.request(
    'GET /repos/{owner}/{repo}/stats/code_frequency',
    {
      owner,
      repo,
    }
  );
  const [, linesAdded, linesRemoved] =
    codeFrequencyResponse.data[codeFrequencyResponse.data.length - 1];
  return { weeklyCommits: { linesAdded, linesRemoved } };
};

const getCommitsInfo = async (owner, repo) => {
  // get latest author from commits list: https://docs.github.com/en/rest/reference/repos#list-commits
  const commitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner,
    repo,
  });
  const lastCommitResponse = commitResponse.data[0];

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
  const { headers } = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner,
    repo,
    per_page: 1,
  });
  const contributorsResponse = headers.link;
  const [, totalContributors] = contributorsResponse.match(/.*"next".*&page=([0-9]*).*"last".*/);

  return {
    totalContributors,
  };
};

module.exports = async function getGitHubData(owner, repo) {
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

    const githubData = {
      weeklyCommits: { ...statsParticipation.weeklyCommits, ...statsCodeFrequency.weeklyCommits },
      yearlyCommits: { ...statsParticipation.yearlyCommits },
      ...commitsInfo,
      ...contributorsInfo,
    };

    await redis.set(`github:info-${repo}`, JSON.stringify(githubData), 'EX', cacheTime);
    return githubData;
  } catch (error) {
    logger.warn({ error }, 'Fail to fetch github data');
  }

  return {};
};
