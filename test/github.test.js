const gh = require('../src/backend/utils/github-url');
global.fetch = require('node-fetch');

beforeEach(() => {
  fetch.resetMocks();
});

/**
 * Test to validate fetching data when passing a user URL.
 * It uses the Seneca-CDOT URL
 */
test('test fetching data for a valid user URL', async () => {
  const validUserUrl = 'https://github.com/Seneca-CDOT';
  const validUserData = {
    user: expect.any(String),
    avatarURL: expect.any(String),
    name: expect.any(String),
    company: expect.any(String),
    blog: expect.any(String),
    email: expect.any(String),
    bio: expect.any(String),
  };

  fetch.mockResponseOnce(
    JSON.stringify(
      {
        login: 'foo',
        avatar_url: 'foo',
        name: 'foo',
        company: 'foo',
        blog: 'foo',
        email: 'foo',
        bio: 'foo',
      },
      { status: 200 }
    )
  );

  const user = await gh.getGithubUrlData(validUserUrl);
  Object.keys(validUserData).map(property => expect(user).toHaveProperty(property));
});

/**
 * Test to validate fetching data when passing a repo URL.
 * It uses the telescope URL
 */
test('test fetching data for a valid repository URL', async () => {
  const validRepoUrl = 'https://github.com/Seneca-CDOT/telescope';
  const validRepoData = {
    avatarURL: expect.any(String),
    description: expect.any(String),
    license: {
      key: expect.any(String),
      name: expect.any(String),
      spdx_id: expect.any(String),
      url: expect.any(String),
      node_id: expect.any(String),
    },
    openIssues: expect.any(Number),
    forks: expect.any(Number),
    createdAt: expect.any(String),
    language: expect.any(String),
  };
  fetch.mockResponseOnce(
    JSON.stringify(
      {
        owner: { avatar_url: 'foo' },
        description: 'foo',
        license: {
          key: 'foo',
          name: 'foo',
          spdx_id: 'foo',
          url: 'foo',
          node_id: 'foo',
        },
        open_issues: 0,
        forks: 0,
        created_at: 'foo',
        language: 'foo',
      },
      { status: 200 }
    )
  );

  const repo = await gh.getGithubUrlData(validRepoUrl);
  Object.keys(validRepoData).map(property => expect(repo).toHaveProperty(property));
});

/**
 * Test to validate fetching data when passing a repo URL.
 * It uses telescope's issue 2
 */
test('test fetching data for a valid issue URL', async () => {
  const validIssueUrl = 'https://github.com/Seneca-CDOT/telescope/issues/2';
  const validIssueData = {
    login: expect.any(String),
    avatarURL: expect.any(String),
    body: expect.any(String),
    createdAt: expect.any(String),
    branch: expect.any(String),
    repo: expect.any(String),
  };

  fetch.mockResponseOnce(
    JSON.stringify(
      {
        user: {
          login: 'foo',
          avatar_url: 'foo',
        },
        body: 'foo',
        created_at: 'foo',
      },
      { status: 200 }
    )
  );

  const issue = await gh.getGithubUrlData(validIssueUrl);
  Object.keys(validIssueData).map(property => expect(issue).toHaveProperty(property));
});

/**
 * Test to validate fetching data when passing a pull request URL.
 * It uses telescope's pull request 1
 */
test('test fetching data for a valid pull request URL', async () => {
  const validPullRequestUrl = 'https://github.com/Seneca-CDOT/telescope/pull/1';
  const validPullRequestData = {
    login: expect.any(String),
    avatarURL: expect.any(String),
    body: expect.any(String),
    createdAt: expect.any(String),
    branch: expect.any(String),
    repo: expect.any(String),
  };

  fetch.mockResponseOnce(
    JSON.stringify(
      {
        user: {
          login: 'foo',
          avatar_url: 'foo',
        },
        body: 'foo',
        created_at: 'foo',
      },
      { status: 200 }
    )
  );

  const pr = await gh.getGithubUrlData(validPullRequestUrl);
  Object.keys(validPullRequestData).map(property => expect(pr).toHaveProperty(property));
});

/**
 * Test for a non valid URL,
 * Case: not a github URL
 */
test('test fetching data for an invalid URL - non-GitHub URL', async () => {
  const invalidURL = 'https://example.com';

  await expect(gh.getGithubUrlData(invalidURL)).rejects.toThrow('Invalid GitHub url');
});

/**
 * Test for a non valid URL,
 * Case: missing https
 */
test('test fetching data for an invalid URL - missing protocol', async () => {
  const invalidURL = 'github.com/Seneca-CDOT/telescope';

  await expect(gh.getGithubUrlData(invalidURL)).rejects.toThrow('Invalid GitHub url');
});

/**
 * Test for a non valid URL,
 * Case: Using insecure connection
 */
test('test fetching data for an invalid URL - insecure connection', async () => {
  const invalidURL = 'http://github.com/Seneca-CDOT/telescope';

  await expect(gh.getGithubUrlData(invalidURL)).rejects.toThrow('Invalid GitHub url');
});
