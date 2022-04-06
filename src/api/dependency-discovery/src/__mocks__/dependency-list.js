let depsList = [];
let depsGitHubIssuesList = {};

module.exports = {
  __setMockDepList: (newDepsList) => {
    depsList = newDepsList;
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
  getGitHubIssues: jest.fn().mockImplementation((dependencyName) => {
    if (depsGitHubIssuesList[dependencyName]) {
      return Promise.resolve(depsGitHubIssuesList[dependencyName]);
    }
    return Promise.resolve([]);
  }),
};
