// This comes via the top level .env and its API_URL value,
// and gets set in next.config.js at build time.
const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;
const imageServiceUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL;

const title = `Telescope`;
const description = `A tool for tracking blogs in orbit around Seneca's open source involvement`;
const author = `SDDS Students and professors`;
const keywords = 'blogfeeds, canada, opensourced';

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
};
