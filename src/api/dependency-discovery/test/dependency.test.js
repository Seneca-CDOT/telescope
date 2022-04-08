const request = require('supertest');
const { app } = require('../src');

const depsList = [
  '@apidevtools/json-schema-ref-parser',
  '@babel/code-frame',
  '@babel/compat-data',
  '@babel/core", "@babel/generator',
  '@babel/helper-annotate-as-pure',
  '@babel/helper-builder-binary-assignment-operator-visitor',
  '@babel/helper-compilation-targets',
  '@babel/helper-create-class-features-plugin',
  '@babel/helper-create-regexp-features-plugin',
  'faker-package',
];

const depsNpmPackageList = {
  '@apidevtools/json-schema-ref-parser': {
    id: '@apidevtools/json-schema-ref-parser',
    license: 'MIT',
    gitRepository: {
      type: 'git',
      url: 'https://github.com/algolia/algoliasearch-client-javascript',
    },
  },
  'faker-package': {
    id: 'faker-package',
    license: 'Apache License 2.0',
    gitRepository: {
      type: 'git',
      url: 'https://github.com/faker-org/faker',
    },
  },
};

const depsGitHubIssuesList = {
  '@babel/code-frame': [
    {
      htmlUrl: 'https://github.com/babel/babel/issues/123',
      title: 'This is a babel-related issue',
      body: 'This is urgent!!',
      createdAt: '2019-04-24T14:10:34Z',
    },
  ],
  'faker-package': [
    {
      htmlUrl: 'https://github.com/faker-org/faker/issues/112',
      title: 'This is a fake issue',
      body: 'This is the body of a fake issue',
      createdAt: '2018-02-08T20:49:23Z',
    },
    {
      htmlUrl: 'https://github.com/faker-org/faker/issues/113',
      title: 'This is a follow up issue from a fake PR',
      body: 'This is the body of a fake issue',
      createdAt: '2018-01-26T16:51:33Z',
    },
  ],
};

jest.mock('../src/dependency-list');
const {
  __setMockDepList,
  __setMockDepsNpmPackageList,
  __setMockDepsGitHubIssuesList,
} = require('../src/dependency-list');

describe('GET /projects', () => {
  beforeEach(() => {
    __setMockDepList(depsList);
  });

  test('Should return 200 and an array of dependencies', async () => {
    const res = await request(app).get('/projects');
    expect(res.status).toBe(200);
    expect(typeof res.body).toEqual('object');
    expect(res.body.length).toBe(depsList.length);
  });
});

describe('GET /projects/:project', () => {
  beforeEach(() => {
    __setMockDepList(depsList);
    __setMockDepsNpmPackageList(depsNpmPackageList);
  });

  test('Should return 200 and an object with the npm package info', async () => {
    const dependencyName = 'faker-package';
    const npmPackageInfo = depsNpmPackageList[dependencyName];
    const res = await request(app).get(`/projects/${dependencyName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(npmPackageInfo);
  });

  test('Should return 200 and an object with the npm package info if dependency name has namespace', async () => {
    const dependencyName = '@apidevtools/json-schema-ref-parser';
    const npmPackageInfo = depsNpmPackageList[dependencyName];
    const res = await request(app).get(`/projects/${dependencyName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(npmPackageInfo);
  });

  test('Should return 404 if dependency does not exist', async () => {
    const dependencyName = 'this-is-not-a-dependency';
    const res = await request(app).get(`/projects/${dependencyName}`);
    expect(res.status).toBe(404);
  });

  test("Should return 500 if dependency couldn't fetch npm package", async () => {
    const dependencyName = '@babel/code-frame';
    const res = await request(app).get(`/projects/${dependencyName}`);
    expect(res.status).toBe(500);
  });
});

describe('GET /github/:project', () => {
  beforeEach(() => {
    __setMockDepList(depsList);
    __setMockDepsGitHubIssuesList(depsGitHubIssuesList);
  });

  test('Should return 200 and an object with the GitHub issues', async () => {
    const dependencyName = 'faker-package';
    const gitHubIssuesForDep = depsGitHubIssuesList[dependencyName];
    const res = await request(app).get(`/github/${dependencyName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(gitHubIssuesForDep);
  });

  test('Should return 200 and an object with the GitHub issues if dependency name has namespace', async () => {
    const dependencyName = '@babel/code-frame';
    const gitHubIssuesForDep = depsGitHubIssuesList[dependencyName];
    const res = await request(app).get(`/github/${dependencyName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(gitHubIssuesForDep);
  });

  test('Should return 404 if dependency does not exist', async () => {
    const dependencyName = 'this-is-not-a-dependency';
    const res = await request(app).get(`/github/${dependencyName}`);
    expect(res.status).toBe(404);
  });

  test('Should return 200 and no list if dependency does not have GitHub issues', async () => {
    const dependencyName = '@apidevtools/json-schema-ref-parser';
    const res = await request(app).get(`/github/${dependencyName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
