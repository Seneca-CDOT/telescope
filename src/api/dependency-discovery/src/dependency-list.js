const { readFile } = require('fs/promises');
const { join } = require('path');
const { cwd } = require('process');
const { getPackument } = require('query-registry');
const { requestGitHubInfo } = require('./github');

const getDependencies = (function () {
  let dependencies = null;

  return async () => {
    if (!dependencies) {
      dependencies = {};
      const dependencyList = await readFile(join(cwd(), 'deps.txt'), 'utf8');

      dependencyList
        .split(/\r\n?|\n/g)
        .filter((line) => line !== '')
        .forEach((name) => {
          // To determine whether a project name is a
          // dependency or not, we initialize to null.
          // Non-dependency project would evaluate to 'undefined'.
          dependencies[name] = null;
        });
    }

    return dependencies;
  };
})();

async function getDependencyList() {
  const dependencies = await getDependencies();
  return Object.keys(dependencies);
}

async function isPackageDependency(packageName) {
  const dependencies = await getDependencies();
  return Object.prototype.hasOwnProperty.call(dependencies, packageName);
}

async function getNpmPackageInfo(packageName) {
  if (!(await isPackageDependency(packageName))) {
    return null;
  }

  const dependencies = await getDependencies();

  if (dependencies[packageName] === null) {
    const { id, license, gitRepository } = await getPackument({ name: packageName });
    dependencies[packageName] = { id, license, gitRepository };
  }

  return dependencies[packageName];
}

async function getGitHubIssues(packageName) {
  const npmPackage = await getNpmPackageInfo(packageName);

  return requestGitHubInfo(packageName, npmPackage.gitRepository.url);
}

module.exports = {
  getDependencyList,
  getNpmPackageInfo,
  isPackageDependency,
  getGitHubIssues,
};
