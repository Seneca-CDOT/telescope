// This comes via the top level .env and its API_URL value,
// and gets set in next.config.js at build time.

// The URL to use when accessing the Telescope 1.0 backend APIs
const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;

// The URL where our front-end is being hosted.
const webUrl = process.env.NEXT_PUBLIC_WEB_URL;

// The various Telescope 2.0 microservice endpoints we use
const imageServiceUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
const ssoServiceUrl = process.env.NEXT_PUBLIC_SSO_URL;
const postsServiceUrl = process.env.NEXT_PUBLIC_POSTS_URL;
const searchServiceUrl = process.env.NEXT_PUBLIC_SEARCH_URL;
const feedDiscoveryServiceUrl = process.env.NEXT_PUBLIC_FEED_DISCOVERY_URL;
const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
const dependencyDiscoveryUrl = process.env.NEXT_PUBLIC_DEPENDENCY_DISCOVERY_URL;

// Github sha commit
const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_ANON_KEY;

const title = `Telescope`;
const description = `A tool for tracking blogs in orbit around Seneca's open source involvement`;
const author = `SDDS Students and Professors`;
const keywords = `Telescope, Seneca College, Open Source, Programming, Software Development, Blogs, Education, CDOT, SDDS, Students, Professors, Learning, Teaching`;
const image = `${telescopeUrl}/logoImages/apple-splash-1334-750.jpg`;
const imageAlt = `Telescope Logo`;

const loginUrl = `${ssoServiceUrl}/login`;
const logoutUrl = `${ssoServiceUrl}/logout`;

export {
  title,
  description,
  author,
  telescopeUrl,
  webUrl,
  ssoServiceUrl,
  imageServiceUrl,
  supabaseUrl,
  anonKey,
  loginUrl,
  logoutUrl,
  keywords,
  image,
  imageAlt,
  postsServiceUrl,
  searchServiceUrl,
  feedDiscoveryServiceUrl,
  statusUrl,
  gitCommitSha,
  dependencyDiscoveryUrl,
};
