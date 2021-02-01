// This comes via the top level .env and its API_URL value,
// and gets set in next.config.js at build time.
const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;

export default {
  title: `Telescope`,
  description: `A tool for tracking blogs in orbit around Seneca's open source involvement`,
  author: `SDDS Students and professors`,
  telescopeUrl,
  loginUrl: `${telescopeUrl}/auth/login`,
  logoutUrl: `${telescopeUrl}/auth/logout`,
  userFeedsUrl: `${telescopeUrl}/user/feeds`,
  feedsUrl: `${telescopeUrl}/feeds`,
  keywords: 'blogfeeds, canada, opensourced',
};
