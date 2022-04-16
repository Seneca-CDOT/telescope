const { request } = require('@octokit/request');

// Check whether a specific time has reached the GitHub time limit.
// @param {Date} datetime - a Date object representing a moment in the past
// @returns {Boolean}
const hasGitHubExpired = (dateTime) => new Date() - dateTime > 60 * 60 * 1000;

const gitHubInformationRequestor = {};

const labels = ['hacktoberfest', 'good first issue', 'help wanted'];

async function constructGitHubRequest(gitHubUrl) {
  const [owner, repo] = new URL(gitHubUrl).pathname.substring(1).split('/');

  const requestPromises = labels.map((label) => {
    return request('GET /repos/{owner}/{repo}/issues{?assignee,state,labels}', {
      owner,
      repo,
      assignee: 'none',
      state: 'open',
      labels: label,
    });
  });

  // A single request might look like a response in
  // https://docs.github.com/en/rest/reference/issues#list-repository-issues
  const responses = await Promise.all(requestPromises);

  return responses
    .filter((response) => response.status === 200)
    .flatMap((response) =>
      response.data.map((issue) => {
        return {
          htmlUrl: issue.html_url,
          title: issue.title,
          body: issue.body,
          createdAt: issue.created_at,
        };
      })
    )
    .filter((issue, index, array) => array.findIndex((i) => i.htmlUrl === issue.htmlUrl) === index);
}

function requestGitHubInfo(packageName, gitHubUrl) {
  const cachedRequest = gitHubInformationRequestor[packageName];

  if (cachedRequest && !hasGitHubExpired(cachedRequest.expireAt)) {
    return cachedRequest.request;
  }

  const newRequest = constructGitHubRequest(gitHubUrl);

  const now = new Date();
  now.setHours(now.getHours() + 1);

  gitHubInformationRequestor[packageName] = {
    expireAt: now,
    request: newRequest,
  };

  return newRequest;
}

module.exports = {
  requestGitHubInfo,
  labels,
};
