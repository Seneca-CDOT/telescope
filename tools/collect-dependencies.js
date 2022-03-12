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

// Warning: the maxBuffer has been increased to 10 MB as a quick solution.
// In the case we hit the limit of the buffer again, we shall rewrite the
// script for a better way to handle it.
const output = execSync('pnpm list -w -r --parseable --depth=2', {
  maxBuffer: 1024 * 1024 * 10, // approx. 10 Megabyte = 1024 bytes per Kilobyte * 1024 Kilobytes per Megabyte * 10 Megabytes
}).toString('utf8');

const regex = /.*\.pnpm\/(@?[^@]+).*/g;

console.log('Processing file...');
const packageNames = [
  ...new Set([...output.matchAll(regex)].map((results) => results[1].replace('+', '/')).sort()),
];

const buffer = packageNames.join('\n');

console.log('Writing to file...');
writeFileSync(filename, buffer);

console.log(`Dependency list written to ${filename}`);
