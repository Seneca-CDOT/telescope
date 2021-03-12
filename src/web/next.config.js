const path = require('path');
const dotenv = require('dotenv');

const loadApiUrlFromEnv = (envFile) =>
  dotenv.config({ path: envFile }).error ? null : process.env.API_URL;

// In certain build contexts (docker-compose) we already have this defined.
// If we don't, try to define it from the env.
if (!process.env.NEXT_PUBLIC_API_URL) {
  // Forward the API_URL value from the root env to NEXT_PUBLIC_API_URL
  if (process.env.API_URL) {
    // API_URL was already set on the env (likely this is
    // happening within docker) so use that.
    process.env.NEXT_PUBLIC_API_URL = process.env.API_URL;
  } else {
    // Try using .env in the root (legacy Telescope 1.0)
    let apiUrl = loadApiUrlFromEnv(path.join(process.cwd(), '../..', '.env'));
    if (apiUrl) {
      process.env.NEXT_PUBLIC_API_URL = apiUrl;
    } else {
      // Use whatever is in env.development (Microservices)
      apiUrl = loadApiUrlFromEnv(path.join(process.cwd(), '../..', 'config/env.development'));
      process.env.NEXT_PUBLIC_API_URL = apiUrl;
    }

    // One last check and a default to the local backend
    if (!process.env.NEXT_PUBLIC_API_URL) {
      process.env.NEXT_PUBLIC_API_URL = `http://localhost:${port}`;
    }
  }
}
console.info(`Using NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL}`);

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
});
