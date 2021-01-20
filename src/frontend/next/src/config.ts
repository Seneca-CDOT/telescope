export default {
  title: `Telescope`,
  description: `A tool for tracking blogs in orbit around Seneca's open source involvement`,
  author: `SDDS Students and professors`,
  // This comes via the top level .env and its API_URL value,
  // and gets set in next.config.js at build time.
  telescopeUrl: process.env.NEXT_PUBLIC_API_URL,
  keywords: 'blogfeeds, canada, opensourced',
};
