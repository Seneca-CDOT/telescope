const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { argv, exit } = require('process');

const option = argv[3];
const filename = argv[4];

if (option !== '-o' || !filename) {
  console.log(`command usage: ${__filename} -o filename`);
  exit(9);
}

console.log('Starting to collect dependencies');

console.log('Invoking pnpm list...');
const output = execSync('pnpm list -w -r --parseable --depth=2').toString('utf8');

const regex = /.*\.pnpm\/(@?[^@]+).*/g;

console.log('Processing file...');
const packageNames = [
  ...new Set([...output.matchAll(regex)].map((results) => results[1].replaceAll('+', '/')).sort()),
];

const buffer = packageNames.join('\n');

console.log('Writing to file...');
writeFileSync(filename, buffer);

console.log(`Dependency list written to ${filename}`);
