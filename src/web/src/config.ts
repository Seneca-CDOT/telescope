// This comes via the top level .env and its API_URL value,
// and gets set in next.config.js at build time.

// The URL to use when accessing the Telescope 1.0 backend APIs
const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;

// The URL where our front-end is being hosted. If we don't have a URL,
// we use the current page's, and include a fallback of '/' for server-side rendering.
const webUrl =
  // Either we have it defined via Docker env,
  process.env.NEXT_PUBLIC_WEB_URL ||
  // Or we're in Vercel, and the host provides it,
  process.env.VERCEL_URL ||
  // Or we need to make a guess.
  (typeof window !== 'undefined' ? window.location.href : '/');

// The various Telescope 2.0 microservice endpoints we use
const imageServiceUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL;
const postsServiceUrl = process.env.NEXT_PUBLIC_POSTS_URL;

const title = `Telescope`;
const description = `A tool for tracking blogs in orbit around Seneca's open source involvement`;
const author = `SDDS Students and Professors`;
const keywords = `Telescope, Seneca College, Open Source, Programming, Software Development, Blogs, Education, CDOT, SDDS, Students, Professors, Learning, Teaching`;
const image = `${telescopeUrl}/logoImages/apple-splash-1334-750.jpg`;
const imageAlt = `Telescope Logo`;

const loginUrl = `${authServiceUrl}/login`;
const logoutUrl = `${authServiceUrl}/logout`;
const userFeedsUrl = `${telescopeUrl}/user/feeds`;
const feedsUrl = `${telescopeUrl}/feeds`;

export {
  title,
  description,
  author,
  telescopeUrl,
  webUrl,
  imageServiceUrl,
  loginUrl,
  logoutUrl,
  userFeedsUrl,
  feedsUrl,
  keywords,
  image,
  imageAlt,
  postsServiceUrl,
};
