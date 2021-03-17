// This comes via the top level .env and its API_URL value,
// and gets set in next.config.js at build time.
const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;
const imageServiceUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL;
const postsServiceUrl = process.env.NEXT_PUBLIC_POSTS_URL;

const title = `Telescope`;
const description = `A tool for tracking blogs in orbit around Seneca's open source involvement`;
const author = `SDDS Students and Professors`;
const keywords = `Telescope, Seneca College, Open Source, Programming, Software Development, Blogs, Education, CDOT, SDDS, Students, Professors, Learning, Teaching`;
const image = `/logoImages/apple-splash-1334-750.jpg`;
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
