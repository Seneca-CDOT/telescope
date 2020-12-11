/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

//import { GetStaticProps } from 'next';

//If you export an async function called getStaticProps from a page, Next.js will pre-render
//this page at build time using the props returned by getStaticProps.
// V1 Joseph assal -> Invalid hook call
// export const getStaticProps: GetStaticProps = async () => {
//   const telescopeUrl = process.env.NEXT_PUBLIC_API_URL;
//   return {
//     props: {
//       telescopeUrl,
//     },
//   };
// };

// V2 -> Cindy Le
export default function useSiteMetadata() {
  const telescopeUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;
  interface SiteMetadata {
    title: string;
    description: string;
    author: string;
    telescopeUrl: string;
  }
  type SiteMetadataPreview = Pick<
    SiteMetadata,
    'title' | 'description' | 'author' | 'telescopeUrl'
  >;
  const site: SiteMetadataPreview = {
    title: `Telescope`,
    description: `A tool for tracking blogs in orbit around Seneca's open source involvement`,
    author: `SDDS Students and professors`,
    telescopeUrl: telescopeUrl,
  };
  return site;
}
