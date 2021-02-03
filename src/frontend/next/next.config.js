const path = require('path');
const dotenv = require('dotenv');

// Forward the API_URL value from the root env to NEXT_PUBLIC_API_URL
const envPath = path.join(process.cwd(), '../../..', '.env');
if (dotenv.config({ path: envPath }).error) {
  console.warn('Unable to read root Telescope .env file.');
} else {
  const apiUrl = process.env.API_URL;

  if (apiUrl) {
    console.info(`Copying API_URL=${apiUrl} to NEXT_PUBLIC_API_URL`);
    process.env.NEXT_PUBLIC_API_URL = apiUrl;
  } else {
    const port = process.env.PORT || 3000;
    console.warn(`No API_URL set in .env, using http://localhost:${port}`);
    process.env.NEXT_PUBLIC_API_URL = `http://localhost:${port}`;
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
});
