/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

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
