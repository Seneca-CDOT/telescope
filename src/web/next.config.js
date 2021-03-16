/**
 * We have various env variables that we need to use in next.js during the build,
 * and which we want to forward to the frontend by prefixing with NEXT_PUBLIC_*.
 * Depending on how this build is run, these variables will have been set already
 * (e.g., via Docker as build ARGs), or we'll try to load an env file automatically
 * (development). Dotenv won't overwrite any value that is already defined in a
 * previous env, so it's safe to do this in all cases.
 */
const path = require('path');
const dotenv = require('dotenv');

// Load an env file
const loadApiUrlFromEnv = (envFile) => dotenv.config({ path: envFile });

// ENV Variables we need to forward to next by prefix with NEXT_PUBLIC_*
const envVarsToForward = ['API_URL', 'IMAGE_URL', 'POSTS_URL'];

// Copy an existing ENV Var so it's visible to next: API_URL -> NEXT_PUBLIC_API_URL
const forwardToNext = (envVar) => {
  if (process.env[envVar]) {
    process.env[`NEXT_PUBLIC_${envVar}`] = process.env[envVar];
  }
};

// Try using .env in the root (legacy Telescope 1.0)
const legacyEnvPath = path.join(__dirname, '../..', '.env');
console.info(`Trying to load missing ENV variables from ${legacyEnvPath}`);
loadApiUrlFromEnv(legacyEnvPath);

// Try using the env.development file in config/ (Telescope 2.0)
const envDevelopmentPath = path.join(__dirname, '../..', 'config/env.development');
console.info(`Trying to load missing ENV variables from ${envDevelopmentPath}`);
loadApiUrlFromEnv(envDevelopmentPath);

// Try to copy them across from existing values
envVarsToForward.forEach((envVar) => forwardToNext(envVar));

// Indicate what the build values we're using are going to be.
envVarsToForward.forEach((envVar) =>
  console.info(`Using NEXT_PUBLIC_${envVar}=${process.env[`NEXT_PUBLIC_${envVar}`]}`)
);

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
});
