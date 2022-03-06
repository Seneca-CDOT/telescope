const { readFile } = require('fs/promises');
const { join } = require('path');
const { cwd } = require('process');
const { getPackument } = require('query-registry');

const dependenciesGlobal = {};

async function getDependencies() {
  if (Object.keys(dependenciesGlobal).length === 0) {
    const dependencyList = await readFile(join(cwd(), 'deps.txt'), 'utf8');

    // The order of the alternatives is important!
    // The regex engine will favor the first pattern on an alternation
    // even if the other alternatives are subpatterns
    for (const dependencyName of dependencyList.split(/\r\n|\n|\r/).filter((line) => line !== '')) {
      dependenciesGlobal[dependencyName] = null;
    }
  }

  return dependenciesGlobal;
}

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
  return dependencies.hasOwnProperty(packageName);
}

module.exports = {
  getDependencyList,
  getNpmPackageInfo,
  isPackageDependency,
};
