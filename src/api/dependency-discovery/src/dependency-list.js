const { readFile } = require('fs/promises');
const { join } = require('path');
const { cwd } = require('process');
const { getPackument } = require('query-registry');

const getDependencies = (function () {
  let dependencies = null;

  return async () => {
    if (!dependencies) {
      dependencies = {};
      const dependencyList = await readFile(join(cwd(), 'deps.txt'), 'utf8');

      dependencyList
        .split(/\r\n?|\n/g)
        .filter((line) => !!line)
        .forEach((name) => {
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

async function isPackageDependency(packageName) {
  const dependencies = await getDependencies();
  return Object.prototype.hasOwnProperty.call(dependencies, packageName);
}

module.exports = {
  getDependencyList,
  getNpmPackageInfo,
  isPackageDependency,
};
