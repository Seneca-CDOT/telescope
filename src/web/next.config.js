// In certain build contexts (docker-compose) we already have this defined.
// If we don't, try to define it from the env.
if (!process.env.NEXT_PUBLIC_API_URL) {
  // Forward the API_URL value from the root env to NEXT_PUBLIC_API_URL
  if (process.env.API_URL) {
    // API_URL was already set on the env (likely this is
    // happening within docker) so use that.
    process.env.NEXT_PUBLIC_API_URL = process.env.API_URL;
  } else {
    // No env, so likely we're working locally, so make a guess:
    const port = process.env.PORT || 3000;
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
  trailingSlash: true,
});
