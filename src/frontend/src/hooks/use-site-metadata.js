/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

import { useStaticQuery, graphql } from 'gatsby';

const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
            description
            author
            telescopeUrl
            version
          }
        }
      }
    `
  );
  return site.siteMetadata;
};

export default useSiteMetadata;
