const { readFile } = require('fs/promises');
const { join } = require('path');
const { cwd } = require('process');

async function getDependencies() {
  const dependencies = await readFile(join(cwd(), 'deps.txt'), 'utf8');

  // The order of the alternatives is important!
  // The regex engine will favor the first pattern on an alternation
  // even if the other alternatives are subpatterns
  return dependencies.split(/\r\n|\n|\r/).filter((line) => line !== '');
}

module.exports = getDependencies;
