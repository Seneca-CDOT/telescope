let depsList = [];
let depsNpmPackageList = {};
let depsGitHubIssuesList = {};

module.exports = {
  __setMockDepList: (newDepsList) => {
    depsList = newDepsList;
  },
  __setMockDepsNpmPackageList: (newDepsNpmPackageList) => {
    depsNpmPackageList = newDepsNpmPackageList;
  },
  __setMockDepsGitHubIssuesList: (newDepsGitHubIssuesList) => {
    depsGitHubIssuesList = newDepsGitHubIssuesList;
  },
  getDependencyList: jest.fn().mockImplementation(() => {
    return Promise.resolve(depsList);
  }),
  isPackageDependency: jest.fn().mockImplementation((dependencyName) => {
    return Promise.resolve(depsList.includes(dependencyName));
  }),
  getNpmPackageInfo: jest.fn().mockImplementation((dependencyName) => {
    if (depsNpmPackageList[dependencyName]) {
      return Promise.resolve(depsNpmPackageList[dependencyName]);
    }
    return Promise.reject(new Error('NPM Package cannot be fetched.'));
  }),
  getGitHubIssues: jest.fn().mockImplementation((dependencyName) => {
    if (depsGitHubIssuesList[dependencyName]) {
      return Promise.resolve(depsGitHubIssuesList[dependencyName]);
    }
    return Promise.resolve([]);
  }),
};
