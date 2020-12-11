/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

import { GetStaticProps } from 'next';

//If you export an async function called getStaticProps from a page, Next.js will pre-render
//this page at build time using the props returned by getStaticProps.
export const getStaticProps: GetStaticProps = async () => {
  const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;
  return {
    props: {
      telescopeUrl,
    },
  };
};
